# german-post-reader — app code lives here

claude code will scaffold the actual application (next.js / react native / whatever your kit needs) INTO this folder.

the parent folder holds:
- `CLAUDE.md` — rules claude reads every turn
- `SPEC.md` — the one-page spec
- `BUILD_PROMPT.md` — paste this into claude code to start the build
- `README.md` — human-readable readme
- `.env.local` — your API keys
- `setup/` — installer machinery (don't touch)

keep CLAUDE.md and SPEC.md at the parent level; they're project-wide. `cd project` from a terminal when you need to run commands against the app. but you shouldn't have to — claude code does that for you.
