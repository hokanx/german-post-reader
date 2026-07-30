---
description: build the next planned stage from SPEC.md later_stages
---

build the next planned stage from `SPEC.md`.

steps:
1. read `SPEC.md` and locate the **later stages** section. if it's missing or empty, tell the user this kit doesn't have planned stages — they should use `/scope-check` to add things to scope, OR re-run the planner with a broader prompt. do NOT invent stages.
2. determine which stages have already shipped: scan `git log --oneline` for commits matching `ship: stage <N> — *`. each such commit means that stage is done. also check `STATUS.md` if it exists.
3. pick the LOWEST-INDEX un-shipped stage in the SPEC.md ordering. don't skip ahead even if a later stage seems more exciting — the planner ordered them by priority.
4. announce to the user, plainly: "next stage: **<name>**. goal: <goal>. scope: <comma-list of scope_in items>. this will take roughly 30-90 minutes and ~$3-10 in tokens. proceed? (y/n)"
5. wait for an explicit "y" — do NOT start without confirmation.
6. on "y", run the full two-phase chain (see BUILD_PROMPT.md "two-phase chain" section):
   a. **brainstorming**: use `superpowers:brainstorming` to design this stage. write the design to `docs/superpowers/specs/stage-<N>-<slug>.md` and commit.
   b. **planning**: use `planning-with-files` to write `docs/superpowers/plans/stage-<N>-<slug>.md` with bite-sized tasks. no placeholders.
   c. **execute**: work through each plan task. commit a checkpoint before each. apply verification-before-completion to every claim of "done."
7. for any UI work in this stage: the UI quality gate from BUILD_PROMPT.md applies. `design-system/MASTER.md` should already exist from v1 — use it. add new pages to `design-system/pages/<page>.md` before writing JSX.
8. terminal rule applies: YOU run every command via Bash. the user types nothing in a terminal.
9. on completion:
   - commit the final state with message: `ship: stage <N> — <stage name>`.
   - update `STATUS.md` (create if missing) with a line: `stage <N> shipped on <YYYY-MM-DD>: <stage name>`.
   - report a 3-bullet summary: what works, what changed in the data model, what the next stage would be.
10. if you get stuck mid-stage and need to bail, do NOT leave the repo in a half-broken state. revert to the pre-stage checkpoint. tell the user honestly: "stage <N> didn't ship cleanly; reverted to <sha>. blocker was: <one sentence>."

never skip the brainstorm → spec → plan chain even for "small" stages. that discipline is how slop is kept out.
