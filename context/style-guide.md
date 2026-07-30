# Style guide — this project's specifics

This project's locked visual direction is **Playful**. Its exact tokens (fonts, palette, radius, density, structure) are in SPEC.md's "design direction" section and mirrored verbatim in `design-system/MASTER.md`. Do not deviate from them.

The single sources of truth, in order:
1. `design-system/MASTER.md` — the locked tokens (colors as OKLCH semantic variables, fonts, type scale, spacing, radius, shadows, motion). Generated during the build.
2. `design-system/pages/<page>.md` — per-page layout briefs.
3. `CLAUDE.md` (root + `components/`, `app/`, `lib/`) — the brand voice, the BANS list, and the design-system coding rules (semantic tokens only, Lucide-only icons at 1.5px, no Inter headings, focus-visible uses `--ring`).

When reviewing or building UI, every color must be a semantic token (`bg-background`, `text-foreground`, `bg-primary`, `bg-muted`, `border-border`, focus ring `--ring`) — never a raw Tailwind color class like `bg-blue-500`. Anything on the BANS list appearing on screen is a blocker.
