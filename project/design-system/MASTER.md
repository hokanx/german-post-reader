# Design System — German Post Letter Reader

Visual direction: **Playful / Bold** (LOCKED — picked by the user in the wizard, SPEC.md). Do not re-derive fonts, palette, or radius. This file is the single source of truth every page brief and every component inherits from.

## tokens (verbatim from SPEC.md's design direction section)

```
fonts:
  heading: Bricolage Grotesque
  body:    Inter
  mono:    JetBrains Mono
  google_fonts_url: https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap

colors:
  background:         #fff7ed
  foreground:         #1a0a2e
  primary:            #7c3aed
  primary_foreground: #ffffff
  accent:             #fb923c
  muted:              #fef3c7
  muted_foreground:   #6b21a8
  border:             #fde68a

radius:
  sm: 14px
  md: 22px
  lg: 36px

density: comfortable

structure:
  shadow_style:  hard-offset
  border_style:  hard
  chip_style:    pill-uppercase
  heading_style: grotesque-bold
  column_layout: standard
  ornament:      sticker
```

## implementation notes (how the tokens above became code)

- **fonts are self-hosted via `next/font/google`**, not a raw `<link>` to `google_fonts_url`. Same three families, same weights (Bricolage Grotesque 500/700/800, Inter 400/500/600/700, JetBrains Mono 400/500) — `next/font` eliminates the external request and font-swap layout shift, which a raw CDN link would introduce. Wired in `src/app/layout.tsx`, exposed as `--font-heading`, `--font-body` (mapped to Tailwind's `--font-sans`), `--font-mono-custom` (mapped to Tailwind's `--font-mono`).
- **`--border` and `--input` resolve to the `foreground` color (#1a0a2e / oklch), not the literal `colors.border` hex (#fde68a).** Measured contrast of `#fde68a` against both `background` (#fff7ed) and `card` (white) is ~1.2:1 — invisible, and directly violates the non-negotiable "visible 1.5–2px hard border" rule (CLAUDE.md UI rules + this file's own `border_style: hard` translation). `foreground` gives 17–18.6:1, matches the example hard-offset shadow color given in SPEC.md itself (`4px 4px 0 #1a0a2e`), and is what every reference product (Arc, Cron, Granola) actually does: a near-black outline, not a pastel one. The pale yellow (`#fde68a`) is kept as the `muted`/pill-chip background family instead, where it belongs.
- full OKLCH light + dark semantic token set lives in `src/app/globals.css` (see below for the derivation). All contrast pairs below were computed with the sRGB → OKLab WCAG relative-luminance formula, not eyeballed.

### light mode contrast (all pass AA)
| pair | ratio |
|---|---|
| foreground / background | 17.55 |
| primary-foreground (white) / primary | 5.70 |
| muted-foreground / muted | 7.83 |
| accent-foreground (foreground) / accent | 8.23 (white on accent fails at 2.26 — never put white text on the accent orange) |
| destructive-foreground (white) / destructive | 4.83 |
| border (foreground) / card (white) | 18.64 |

### dark mode contrast (all pass AA)
| pair | ratio |
|---|---|
| foreground / background | 17.06 |
| primary-foreground (dark) / primary (light purple) | 6.85 |
| muted-foreground / muted | 9.92 |
| accent-foreground (dark) / accent (light orange) | 11.05 |
| destructive-foreground (dark) / destructive (light red) | 6.74 |
| border (foreground, light cream) / background | 17.06 |

## how to translate structure tokens into code

- **shadow_style = hard-offset** → hard offset shadow, NO blur: `shadow-[4px_4px_0_0_var(--foreground)]` (or the dark-mode equivalent using the dark border color). Always paired with a hard border.
- **border_style = hard** → `border-2 border-border` (2px solid) on every card, button, and input.
- **chip_style = pill-uppercase** → `rounded-full uppercase tracking-[0.06em] font-bold` pill, saturated accent bg (e.g. `bg-accent text-accent-foreground` or `bg-primary text-primary-foreground`).
- **heading_style = grotesque-bold** → `font-heading font-extrabold tracking-[-0.02em]`, oversized at hero (`text-5xl` md `text-7xl`+).
- **column_layout = standard** → standard 1-fr layout, shadcn-style cards/sections.
- **ornament = sticker** → one rotated (2–3deg), hard-bordered, saturated-accent badge/graphic per hero or empty state. Used sparingly.

## radius

- `--radius-sm: 0.875rem` (14px) → inputs, small chips
- `--radius-md: 1.375rem` (22px) → cards
- `--radius-lg: 2.25rem` (36px) → hero panels, large modals
- never below 12px anywhere; never square corners.

## motion system (framer-motion)

- **durations**: fast `0.15s` (hover/tap), base `0.25s` (entrances), slow `0.4s` (hero/route). Nothing animates longer than `0.4s`.
- **easing**: ease-out `[0.22, 1, 0.36, 1]` for entrances; ease-in-out for state changes. Direction is playful/bold, so springs are allowed for hover/tap feedback (`type: 'spring', stiffness: 300, damping: 20`) — but entrances still use the ease-out curve, not bounce, so content doesn't feel laggy.
- **standard variants**: `fadeRise` (opacity 0→1, y 12→0), `stagger` (parent staggers children ~0.06–0.08s), `hoverLift` (scale 1.02 + shadow grows), `tap` (scale 0.98).
- **applied**: hero/section entrances animate on mount (`animate={{...}}`, not `whileInView`) — a scroll-gated `whileInView` + `viewport={{ once: true }}` risks content staying permanently invisible if the IntersectionObserver never fires (confirmed as a real bug: a below-the-fold section rendered blank on a real device and in automated full-page screenshots); mount-triggered animation completes well before a user scrolls there, so it looks the same in practice with none of the risk. card grids/lists stagger children; interactive cards/buttons get `whileHover`/`whileTap`; modals/sheets/route changes use `AnimatePresence`.
- **accessibility**: every animated component calls `useReducedMotion()`; when true, drop transforms and keep opacity-only (or no) transition. Never animate a property that shifts layout after paint.

## reference products

Arc Browser, Granola, Cron (early), Loops.so, Tella, Riverside — see `docs/design-refs/` for saved reference screens (lazyweb MCP).

## anti-patterns (never do)

Muted pastels, serif typography, sub-12px radius, monochrome palettes, tight grids, Inter as a heading font, purple/blue hero gradients, default shadcn gray as the whole palette, testimonial carousels, three-column link footers, icon-grid "feature" sections.
