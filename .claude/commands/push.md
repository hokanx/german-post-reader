---
description: commit + push to GitHub — creates the repo if missing
---

push the current branch to a GitHub remote. set up the repo if it doesn't exist yet.

1. run `git status` via Bash. if there are uncommitted changes:

   > you have <N> uncommitted files. commit them first with a one-line message? (y/n, or type your own commit message)

   on "y": you write the commit message yourself based on the diff (`git diff --stat` to pick a good one). on a custom message: use it verbatim. on "n": stop — the user wants to handle commits manually.

2. check if a GitHub remote is already configured: `git remote -v`. if there's an `origin` that points at github.com:
   - confirm with `git remote get-url origin` — show the user the URL.
   - go to step 5.

3. if there's no GitHub remote yet:
   - prefer the github-mcp if it's registered (`claude mcp list`). use it to create a **private** repo named after `<slug>` from SPEC.md. capture the returned URL.
   - fallback to the `gh` CLI if github-mcp isn't available: `gh repo create <slug> --private --source=. --remote=origin` from inside the kit root. install `gh` via `brew install gh` / equivalent only if asked.
   - fallback to plain git if neither is available: tell the user clearly that they need to either install `gh` (one-time, you offer to run the install) or register github-mcp. wait for them to pick. do NOT ask them to manually create the repo on github.com.

4. once the repo exists, add the remote if not already added: `git remote add origin <repo URL>`.

5. push the current branch with upstream tracking: `git push -u origin HEAD`. capture output.

6. on success, report:

   > pushed to <github URL>
   > branch: <branch-name>
   > <N> commits pushed.
   >
   > want me to also link this repo to your vercel project so future commits auto-deploy? (y/n)

7. on "y" to auto-deploy: run `vercel git connect` from inside `project/`. report the result.

## error handling

- **"Authentication failed" / "permission denied"** → tell the user to set up SSH or HTTPS auth via `gh auth login`. you can run `gh auth login` and walk them through which option to pick (HTTPS + browser is easiest for non-developers).
- **"repository already exists"** → ask the user if they want to use the existing repo (then `git remote add origin <url>` and push), or pick a different name.
- **"failed to push some refs" / non-fast-forward** → the remote has commits the local branch doesn't. ask the user: pull first (recommended) or force-push (only if local is authoritative — DOUBLE-confirm before force-pushing).
- **Network error** → check with `curl -sI https://github.com`. report honestly.

never run `git push --force` without two explicit confirms.
never delete commits, never amend without confirmation.

terminal rule: YOU run every command via Bash. user types only short responses ("y", "n", commit message, or repo name).
