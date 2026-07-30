---
description: add a single feature not in the current spec — pick v1 inclusion or new stage
---

add a single feature to the project. the feature name is in $ARGUMENTS — if it's empty, ASK the user "what feature do you want to add? (one phrase)" and wait.

1. read `SPEC.md` carefully. understand what's in v1, what's in later_stages.
2. think about the feature for 30 seconds. is it a small addition to v1, or a coherent expansion that deserves its own stage?
3. ask the user to choose, with your recommendation:

   > **adding:** "$ARGUMENTS"
   >
   > i'd put this in: **v1** / **a new later stage** — <one-sentence rationale>
   >
   > 1. add to v1 (build it now, ships in the current version)
   > 2. add as a new later stage (planned but not built today — run /next-stage when ready)
   > 3. discard (you've decided it's not worth doing)
   >
   > which? (1/2/3)

4. on **(1) add to v1**:
   a. update `SPEC.md` mvp_scope_in to include this feature, phrased as "<feature> works." show the user the diff first.
   b. commit the spec change: `spec: add <feature> to v1`.
   c. run the brainstorm → spec → plan → code chain for JUST this feature (see BUILD_PROMPT.md "two-phase chain"). do NOT rebuild v1 — extend it.
   d. apply the UI quality gate for any new UI. apply verification-before-completion before claiming done.
   e. commit: `feat: <feature> — <one-line summary>`.

5. on **(2) add as a new later stage**:
   a. ask the user a clarifying question: "this stage's user-facing goal is: <propose one>. correct, or want to refine?"
   b. on confirm, append a new entry to `SPEC.md` later_stages: `{ name: "stage <N+1> · <feature>", goal: "<the goal>", scope_in: [<2-4 derived items, ask user to confirm>] }`. show diff first.
   c. commit: `spec: plan stage <N+1> · <feature>`.
   d. stop. tell the user: "added to roadmap. run /next-stage when you're ready to build it."

6. on **(3) discard**: just acknowledge and stop. no changes.

terminal rule applies throughout — YOU run every command via Bash. user types `1` / `2` / `3` and short answers only.

do NOT modify SPEC.md without showing the diff first. do NOT start building before the user picks an option.
