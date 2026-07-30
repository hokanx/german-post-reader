---
description: blocking design-review gate on a live page (chrome-devtools a11y tree + screenshot artifact)
---

run the **blocking design-review gate** on a live page. this is the OneRedOak design-review workflow adapted to a live preview. terminal rule applies — YOU run every command via Bash, the user types nothing.

the page to review is in $ARGUMENTS (a route like `/dashboard` or a page name like "dashboard"). if empty, review the homepage `/`.

## the iron law (read first — non-negotiable)

**you may NOT report this review as PASS unless a screenshot file physically exists at `artifacts/review/<page>.png`.** "looks great", "the code looks correct", "it should render fine" with no screenshot file on disk = AUTOMATIC FAIL. this guards the known failure mode where the browser MCP silently disconnects and the agent passes off reading source code. at the end you will `ls artifacts/review/<page>.png` and paste the output. no file, no pass. ever.

## step 1: live environment (NOT source code)

1. if the dev server isn't running, start it yourself via Bash (`cd project && npm run dev` in the background). never ask the user to run it.
2. derive `<page>` as a filesystem-safe slug of the route (`/` → `home`, `/dashboard` → `dashboard`, `/settings/profile` → `settings-profile`). `mkdir -p artifacts/review`.

## step 2: accessibility tree FIRST (primary input)

3. using the **chrome-devtools MCP**, `navigate_page` to the route on the dev server.
4. run `take_snapshot` (the **accessibility tree**) — this is the PRIMARY input for the review, not the pixels. read it for: semantic structure (landmarks, headings order, lists), every interactive element's accessible name/role, form labels, and alt text. a button with no accessible name, a skipped heading level, or an unlabeled input is a [Blocker] you find HERE.
5. capture the screenshot artifact: `take_screenshot` (full page, 1440px) and SAVE it to `artifacts/review/<page>.png`. then also screenshot at 768px and 375px for responsive review (these can be `<page>-tablet.png` / `<page>-mobile.png`).
6. run `lighthouse_audit` (performance + accessibility + best-practices) on the route. record the a11y score and any failed audits.
7. `list_console_messages` — any errors/warnings are findings.

## step 3: invoke the design-review subagent

8. invoke the **design-review** subagent (`.claude/agents/design-review.md`). hand it: the route, the `take_snapshot` output, the three screenshots, the lighthouse results, and the console messages. tell it to evaluate against:
   - `context/design-principles.md` (the Stripe/Airbnb/Linear-grade rubric — the universal bar)
   - `context/style-guide.md` + `design-system/MASTER.md` (THIS project's locked tokens/fonts/palette/motion)
   - the **BANS list** and brand voice in `CLAUDE.md` — anything on the bans list rendered on the page is an automatic [Blocker]
   - if `artifacts/golden.png` exists, compare visual quality against it — this page must clear the same bar as the golden page.

## step 4: verdict (blocking)

9. the subagent returns a triage report (Blocker / High-Priority / Medium / Nit). apply the verdict:
   - **any [Blocker] or [High-Priority] finding → FAIL.** fix the underlying code, re-screenshot, re-run this gate. repeat until clean.
   - Medium/Nit may be logged to `docs/review-backlog.md` and deferred.
10. **before claiming PASS**, run `ls -la artifacts/review/<page>.png` and paste the output. if the file is missing (browser MCP disconnected, screenshot failed), the review is FAIL regardless of what the code looks like — re-run from step 1.
11. final output: the triage report, the `ls` proof of the screenshot artifact, the lighthouse a11y score, and an explicit `design-review: PASS` or `design-review: FAIL — <reason>`.
