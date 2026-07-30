---
description: diagnose the current error — 3 ranked hypotheses, no code changes
---

you are DIAGNOSING only. DO NOT modify any code in this command.

1. read the most recent error / failure output. if it's not in your context, ask the user to paste it.
2. run `git status` and `git log --oneline -5` via Bash to understand what just changed.
3. propose 3 root-cause hypotheses ranked by likelihood. for each, give:
   - **what specifically would cause this**: one sentence
   - **the smallest possible fix**: one sentence
   - **files involved**: exact paths
4. at the bottom, recommend which hypothesis to investigate first and why.
5. wait for the user to pick. do not start fixing.

format:
- **hypothesis 1 (most likely):** <cause>. fix: <smallest fix>. files: <paths>.
- **hypothesis 2:** ...
- **hypothesis 3:** ...
- **i'd start with:** <number> — <one-sentence reason>.

if the user types a number, only THEN start the fix — and apply verification-before-completion before claiming it's done.
