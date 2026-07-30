---
description: ship + deploy v1 to vercel preview, return live URL
---

run the full ship + deploy chain. terminal rule applies — YOU run every command via Bash, the user types nothing in a terminal. the only user-typed responses you should accept are short answers like "y", "n", or "done".

## stage 1: local checks

1. read `CLAUDE.md` and `SPEC.md` to refresh on what was supposed to ship.
2. `cd project` and run the test suite (check package.json scripts — `npm test`, `vitest`, etc.). report pass/fail counts honestly. on any failure, STOP and report — do not proceed.
3. start the dev server (Bash, you run it) and use chrome-devtools-mcp to screenshot the homepage at BOTH 375px and 1440px. attach both.
4. run a final ui-ux-pro-max review pass on the screenshots. fix every CRITICAL finding (a11y, touch, contrast, focus rings). re-screenshot. repeat until clean. apply the slop checklist from BUILD_PROMPT.md before continuing.
5. write a 5-bullet summary: what works · what's broken · what's deferred · what surprised you · what i should do next. compare against `SPEC.md` mvp_scope_in vs later_stages — call out drift explicitly.
6. commit everything: `ship: v1 — <one-line summary>`. do NOT push to git remote without explicit user confirmation.

## stage 2: deploy gate

7. announce to the user, plainly:

   > v1 is clean — tests pass, screenshots verified.
   > about to deploy to vercel as a **preview** (not production yet).
   > takes ~2–4 minutes. you can cancel later if you don't like it.
   > proceed? (y/n)

   only proceed on a literal "y". on "n", stop here cleanly — the work is committed locally.

## stage 3: deploy to vercel preview

8. **install the vercel CLI.** run `vercel --version`. if it errors (CLI not installed), install it yourself via `npm install -g vercel`. do not ask the user to run this.

9. **authenticate via token — NO browser login.** read `.env.local` at the kit root for `VERCEL_TOKEN`. the user set this on the kit page precisely so deploys stop re-authenticating every session.
   a. if `VERCEL_TOKEN` is present and non-empty: `export VERCEL_TOKEN="<value>"` in the shell BEFORE any vercel command. the vercel CLI reads it automatically, so `whoami` / `link` / `env` / `deploy` below all run non-interactively. confirm with `vercel whoami` — it prints the account tied to the token. **every vercel command in the rest of this stage inherits this exported token; do not prompt for login again.**
   b. ONLY if `VERCEL_TOKEN` is absent or `vercel whoami` still fails, fall back:

      > i need to authenticate vercel once. easiest: create an access token at <https://vercel.com/account/settings/tokens> (free, 10 seconds), paste it here, and i'll save it to `.env.local` so this never happens again.

      when the user pastes a token: write it to `.env.local` as `VERCEL_TOKEN=<value>`, `export` it, re-run `vercel whoami`. if it still fails, report honestly and stop — do NOT loop on browser login.

10. **link the project if not linked.** check for a `.vercel/` folder inside `project/`. if missing, run from inside `project/`: `vercel link --yes --project=<slug>` where `<slug>` is the project_slug from SPEC.md. this creates the link non-interactively.

11. **auto-push env vars to vercel.** read `.env.local` at the kit root. run `vercel env ls` to see what's already set on vercel for the `preview` env. for each key in `.env.local` that is NOT already on vercel, push it via `printf '%s' "<value>" | vercel env add <KEY> preview`. don't ask per-var — the user already said y at the deploy gate (step 7), that covers it. log each push as `pushed <KEY> to vercel`.

    **localhost rewrite (important):** before pushing, scan `.env.local` for any URL-shaped vars (`*_URL` or named `NEXTAUTH_URL` / `SITE_URL` / `APP_URL`) whose value is `http://localhost:3000` or `http://localhost:<port>`. those were placeholders from the kit page — they MUST NOT go to vercel as-is. on the first deploy you don't know the URL yet, so push them as `https://placeholder.vercel.app` and remember to rewrite after step 13 once you have the real URL. on a redeploy where you already have a URL (check `vercel ls --scope <team>` or the previous deploy URL from `.vercel/output`), use that. after step 13 (URL parsed), if you pushed any placeholder URLs, run `vercel env rm <KEY> preview --yes` then `printf '%s' "<real URL>" | vercel env add <KEY> preview` for each, and trigger one more `vercel` redeploy so the URLs take effect.

12. **deploy.** from inside `project/`, run: `vercel` (no `--prod` flag — this is preview). capture stdout AND stderr.

13. **parse the URL.** vercel prints the preview URL on the last line, usually as `https://<project>-<hash>-<user>.vercel.app`. extract it from stdout. if you can't find it, dump the full stdout to the user and report honestly.

14. **verify the deploy actually works.** use chrome-devtools-mcp to navigate to the URL and screenshot the home page. if you get a 500 or 404 or "Deployment is currently building", wait 30 seconds (sleep), refresh, retry up to 3 times.

15. **report success.** final output to the user:

    > **deployed:** <URL>
    > opened it for you in chrome-devtools — screenshot attached.
    > this is a **preview** deployment, not production. anyone with the link can view it.
    > want me to promote it to production with a real `.vercel.app` domain (or attach a custom domain you own)? (y/n)

    on "y", run `vercel --prod` and re-verify with a screenshot. on "n", stop cleanly.

## deploy error handling

if anything in stage 3 fails, **do NOT thrash**. read the actual error and respond:

- **"Authentication" / "Token" error** → the `VERCEL_TOKEN` is missing, invalid, or expired. ask the user to create a fresh one at <https://vercel.com/account/settings/tokens>, write it to `.env.local` as `VERCEL_TOKEN`, `export` it, and retry once. do NOT fall back to interactive `vercel login` / browser unless the token path is exhausted.
- **"Missing environment variable: X"** → name the var, ask if they want it pushed from .env.local. if it's not in .env.local either, ask the user for the value.
- **Build failure on vercel side** → run `vercel inspect <URL> --logs` to fetch the build log. find the actual error line. propose the smallest fix. show the user the diff before applying it. commit the fix, then re-run `vercel` (back to step 12).
- **Rate limit / "Too many deployments"** → wait 60 seconds (sleep 60), retry ONCE. if still failing, stop.
- **DNS / network error** → check the user's internet (`curl -sI https://vercel.com` should return 200). if reachable, retry once; if not, tell the user honestly.

do NOT retry the same failed command more than once without changing something. if the deploy fails twice, commit any fixes you applied, summarize the blocker honestly in 2 sentences, and stop.

do not declare done until every step produced evidence: test output, screenshots, commit sha, AND a working live URL the user can click.
