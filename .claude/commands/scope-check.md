---
description: compare current work against SPEC.md — flag scope creep
---

protect v1 from scope creep:

1. read `SPEC.md`, specifically the `mvp_scope_in` and `mvp_scope_deferred` sections.
2. run `git status` and `git log --oneline -10` via Bash to see uncommitted work + recent commits.
3. for each item in `mvp_scope_in`: report status (shipped / in progress / not started). if shipped, name the commit sha.
4. for each piece of recent work or uncommitted change: which `mvp_scope_in` item does it serve? if none, it's scope creep.
5. output a table:
   | spec item | status | last commit |
6. below the table, list **scope creep candidates** — work that doesn't map to any spec item.
7. for each creep candidate, ask the user: defer (move it to a NEXT.md backlog), or expand SPEC.md to include it? do not decide for them. do not modify SPEC.md without explicit user say-so.
