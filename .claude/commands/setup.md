---
description: first-run setup — install all skills + mcps for this kit
---

you are running the one-time setup for this kit. the user is a non-developer; YOU run every command via Bash, the user types nothing in a terminal.

steps:
1. check if claude code is up to date. if not, tell the user how to update (one line, no terminal).
2. register required plugin marketplaces (use `claude plugin marketplace add` via Bash):
   - obra/superpowers-marketplace
   - multica-ai/andrej-karpathy-skills
   - nextlevelbuilder/ui-ux-pro-max-skill
   - masonjames/Shadcnblocks-Skill
   - ChromeDevTools/chrome-devtools-mcp
   - anthropics/skills  (provides frontend-design)
   - aboul3ata/lazyweb-skill  (provides lazyweb skills + MCP)
3. install the universal skills (`claude plugin install <name>@<marketplace> --scope user`):
   - superpowers@superpowers-marketplace
   - andrej-karpathy-skills@andrej-karpathy-skills
   - ui-ux-pro-max@ui-ux-pro-max-skill
   - shadcn-ui@shadcnblocks-skill
   - example-skills@anthropic-agent-skills  (bundles frontend-design — the aesthetic-commit enforcer)
   - lazyweb@lazyweb  (provides /lazyweb:* sub-skills for grounding designs in real app screens)
   - planning-with-files (via `npx skills add planning-with-files`)
4. install web-design-guidelines by copying its SKILL.md into the user-scope skills dir (it ships as copy-paste only, no marketplace):
   - source: `setup/universal-core/skills/web-design-guidelines/SKILL.md`
   - dest: `$HOME/.claude/skills/web-design-guidelines/SKILL.md`
   - run: `bash setup/universal-core/skills/web-design-guidelines/install.sh`
5. install the 4 universal mcps:
   - context7 (`claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp`)
   - chrome-devtools-mcp (`claude plugin install chrome-devtools-mcp --scope user`)
   - playwright (`claude mcp add playwright -- npx -y @playwright/mcp@latest`)
   - lazyweb (already configured in .mcp.json — it shells out to `mcp-remote` against https://www.lazyweb.com/mcp; you just need to fetch the bearer token, see step 6)
6. fetch the lazyweb MCP token (free, no email/login required) and write it where .mcp.json reads it:
   - `TOKEN=$(curl -sfX POST https://www.lazyweb.com/api/mcp/install-token -H 'content-type: application/json' -d '{}' | sed -nE 's/.*"token"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p')`
   - `mkdir -p ~/.lazyweb && printf '%s' "$TOKEN" > ~/.lazyweb/lazyweb_mcp_token && chmod 600 ~/.lazyweb/lazyweb_mcp_token`
   - if the token fetch fails (network/endpoint down), report it honestly and continue — lazyweb MCP will be inert until the token is present. you can re-run `bash setup/universal-core/mcps/lazyweb/install.sh` later.
7. verify with `claude mcp list` and report which servers came back green. the **design-review** gate (`/design-review`) depends on the **chrome-devtools** and **playwright** MCPs — call out explicitly if either is not green, because the per-page quality gate can't run without them.
8. the **design-review subagent** ships inside this kit at `.claude/agents/design-review.md` (plus its rubric in `context/design-principles.md` + `context/style-guide.md`) — it's copy-in, nothing to install. just confirm the file is present via `ls .claude/agents/design-review.md` and report it.
9. set up the obsidian vault project folder so session-save can write summaries here:
   - determine project name from `basename "$(pwd)"`
   - resolve vault path from `$CLAUDE_VAULT_PATH`, then `$HOME/obsidian-vault`, then `$HOME/Documents/Obsidian Vault`. if none exist, skip this step and report "no vault detected — skipping project folder."
   - if vault found, create `<vault>/projects/<name>/` if not already present, with three starter files:
     - `session-state.md` containing: `# session state\n\nproject initialized via /setup. no work done yet.\n\n## next move\n\nrun /build-it.\n`
     - `session-log.md` containing: `# session log\n`
     - `CLAUDE.md` containing: `# <name> — project notes\n\nproject-specific notes claude reads on every session. add anything claude should know that does not belong in the universal vault CLAUDE.md.\n`
   - report the path you created. if the folder already existed, report that — don't overwrite.
10. report any failures honestly. for each failure, point to the matching README in `setup/universal-core/skills/` or `setup/universal-core/mcps/`.
11. tell the user: "setup done. close this window and reopen cursor (cmd+q then re-open the folder) so the new skills load. when you're back, type /build-it to start building."

do NOT proceed to /build-it automatically — the user needs to reload claude code for the newly installed plugins to be picked up.
