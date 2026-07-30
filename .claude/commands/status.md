---
description: where am i? — v1 progress, uncommitted work, next move
---

report the current project status. NO code changes — read-only.

gather, in order:

1. read `SPEC.md` to know what mvp_scope_in items are supposed to ship in v1, and what's in later_stages.
2. read `STATUS.md` if it exists.
3. run `git log --oneline -20` and `git status` via Bash.
4. for each `mvp_scope_in` item, search recent commits for one that implements it. mark each as `shipped` (with the commit sha) or `not started` / `in progress`.
5. for each `later_stages` entry, check git log for a `ship: stage <N>` commit. mark as `shipped` or `not started`.
6. look for the last deploy URL: read `.vercel/output` if it exists, or grep recent commits for "deployed:" lines.
7. grep the codebase for unresolved markers: `grep -rn "TODO\|FIXME\|XXX" project/ --include="*.ts" --include="*.tsx" | head -10` (truncate the rest).
8. compute what's uncommitted from `git status --porcelain` — count files, name the top 5.

output ONE markdown block with this exact structure (fill in the values, omit any section that's truly empty):

```
## status: <project_slug>

**v1:** <shipped on YYYY-MM-DD / in progress / not started>
- mvp_scope_in: <N>/<TOTAL> items shipped
- last deploy: <URL or "none yet">

**stages (post-v1):**
- stage 1 (<name>): shipped <sha>
- stage 2 (<name>): not started — run /next-stage
- stage 3 (<name>): not started

**uncommitted work:** <N> files
- src/foo.tsx
- src/bar.ts
- ... (and N more)

**open blockers** (from code search):
- TODO in src/payments.ts:42 — handle Stripe webhook retry
- FIXME in src/auth.ts:88 — guest mode not implemented

**suggested next move:**
1. <one specific action — e.g. "/next-stage to start payments">
2. <or the next-best move>
```

keep it scannable. don't editorialize beyond the "suggested next move" line. if you genuinely don't know what to recommend, say "i'd start with /scope-check to ground yourself before deciding."

if `SPEC.md` is missing, this is a fresh kit that hasn't run `/build-it` yet — say that and recommend `/setup` followed by `/build-it`.
