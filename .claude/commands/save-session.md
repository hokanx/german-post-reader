---
description: force-write the obsidian vault summaries (session-state, session-log, lessons, decisions)
---

force-write the vault summaries for the current project. follow the vault's CLAUDE.md exactly — do not invent your own format.

1. resolve the vault path: try `$CLAUDE_VAULT_PATH`, then `$HOME/obsidian-vault`, then `$HOME/Documents/Obsidian Vault`. if none exist, stop and tell the user "no vault detected — run /setup first or set CLAUDE_VAULT_PATH."

2. determine the current project name from `basename "$(pwd)"`.

3. make sure `<vault>/projects/<name>/` exists. if it doesn't, create it with the same starter files /setup would have created (session-state.md, session-log.md, project CLAUDE.md). report you did this.

4. **overwrite** `<vault>/projects/<name>/session-state.md` with a compact, current snapshot:
   - "## v1 state" — what is working, what is broken, what is half-done
   - "## next move" — the single most important thing to do in the next session
   - "## open questions" — anything blocked on a decision from the user
   keep it under 40 lines. it's a status board, not a journal.

5. **append** a dated entry to `<vault>/projects/<name>/session-log.md`. format:
   ```
   ## YYYY-MM-DD HH:MM
   - what we did (3-6 bullets)
   - any commits made (sha + one-line summary)
   - any blockers hit
   ```
   this file accumulates forever — only append.

6. flush any pending notes:
   - bugs that took >10 min to debug this session → append entries to `<vault>/lessons-learned.md` + one-liners to `lessons-summary.md`
   - architecture decisions made this session → append entries to `<vault>/decisions-log.md` + one-liners to `decisions-summary.md`
   - raw thoughts not worth curating → `<vault>/inbox/`

7. if you learned anything reusable about a specific stack (next.js, expo, stripe), append to `<vault>/stack-notes/<stack>.md`. don't duplicate stack-wide notes in project-specific files.

8. **never** write secrets, api keys, or passwords to the vault. if a secret came up this session, write a placeholder like "(rotated key — see 1password)" instead.

9. report back: list every file you wrote/appended to, and confirm the user can stop the session now.

after this command, the session-save hook (which fires on every Stop event) will see fresh writes and pass through silently instead of blocking.
