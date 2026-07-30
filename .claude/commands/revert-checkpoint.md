---
description: roll back to a previous checkpoint commit (two confirms before reset)
---

one-click rewind. NO code changes until the user explicitly confirms TWICE.

1. run `git log --oneline -30 --all` via Bash to find recent commits.
2. extract the commits whose message matches `checkpoint: before *` — these are the safe rewind points the build chain wrote.
3. show the user a numbered list of the 5 most recent checkpoints with their commit message and timestamp.
4. ask: "which checkpoint do you want to roll back to? (1-5, or N to cancel)"
5. on a number, show the diff that would be DISCARDED: run `git diff <sha>..HEAD --stat` and `git diff <sha>..HEAD` (truncate if huge). tell the user "this is what i'm about to throw away. type YES to confirm reset."
6. ONLY on a literal YES, run `git reset --hard <sha>`. then `git status` to confirm.
7. on N or anything that isn't YES: cancel, report no changes made, suggest the user can also `git stash` if they want to keep the work around.

NEVER run `git reset --hard` without two explicit confirmations.
