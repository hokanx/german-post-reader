# Page brief: landing (`/`)

Inherits all tokens from `design-system/MASTER.md` — no new fonts/colors/radii here. This brief only decides layout, section order, and named block sources.

**note on process:** the `lazyweb` MCP (real reference-screen fetch) wasn't connected in this session (no `lazyweb_*` tools registered — likely a missing install token). This brief is grounded in the named reference products (Arc Browser, Granola, Cron, Loops.so, Tella, Riverside) from direct knowledge instead of fetched screenshots. If `lazyweb` becomes available later, re-run it and diff this brief.

## audience + goal

Immigrants/expats in Germany, often stressed about an unread official letter. The hero has one job: convince them in 3 seconds that this is fast, trustworthy-feeling (despite the loud aesthetic — playful ≠ careless), and free to try. One primary CTA: start free trial.

## section order

1. **Nav** — logo/wordmark left, language selector (EN/AR/TR, cookie-based, no auth needed) + "Log in" + "Start free trial" button right. Sticky, transparent-over-hero then solid on scroll.
2. **Hero** — oversized grotesque-bold headline, one sentence subhead, primary CTA button, a sticker-ornament graphic (rotated badge, hard border, saturated accent — inline SVG, e.g. a stamped "3 FREE LETTERS" badge rotated -3deg near the headline, echoing a postal stamp motif since the product is literally about postal letters). NOT a screenshot-in-browser-chrome hero (too generic/SaaS-default) — instead a large card mockup of the actual analysis result (summary + deadline chip + reply draft snippet) tilted slightly, hard-offset shadow, to show the product doing its job.
3. **How it works** — 3-step horizontal row (Upload → Analysis → Reply), each step a hard-bordered card with a Lucide icon, not a generic icon-grid "features" section (banned) — these are sequential steps with numbers, not a flat feature list.
4. **Trust / risk-flags callout** — one card explaining the risk-flags behavior ("we tell you when we're not sure — never guess at a number") since this is the product's actual trust mechanism, more persuasive than fake testimonials (testimonial carousels are banned anyway).
5. **Pricing** — single plan card (not a 3-tier grid — v1 has one plan), pill-uppercase "3 FREE LETTERS" trial chip at the top of the card, price, feature bullets, CTA button.
6. **Final CTA band** — full-width saturated-accent band, short headline, CTA button. Sticker ornament repeated (smaller) for visual rhyme with hero.
7. **Footer** — NOT a three-column link footer (banned). Single row: wordmark, 3-4 links (Privacy, Terms, Contact), language selector echo. Minimal, doesn't compete with the CTA above it.

## named blocks (shadcnblocks-skill — pull these, adapt to MASTER.md tokens)

**note on process:** `SHADCNBLOCKS_API_KEY` isn't configured in this environment (no key, no 1Password CLI), so the premium block registry is unavailable. Sections below were hand-built from free shadcn/ui primitives (Button, Card) + custom Tailwind directly against this brief, instead of installing pre-built `@shadcnblocks/*` blocks. The named block descriptions below are kept as the layout intent that was actually followed.


- Hero: a split hero block (headline+CTA left, product-mockup card right) — adapt to remove any gradient background and apply hard-offset shadow to the mockup card.
- How-it-works: a numbered-steps/process block (3 steps, horizontal on desktop, stacked on mobile).
- Pricing: a single-plan pricing card block (not a comparison table).
- CTA band: a centered CTA-band block.
- Footer: a minimal/simple footer block (not the multi-column variant).

## responsive

Mobile: hero mockup card stacks below headline (not beside). How-it-works steps stack vertically with a vertical connector line instead of horizontal arrows. Nav collapses to a hamburger sheet (language selector + login + CTA inside).

## motion

- Hero: `fadeRise` on headline/subhead/CTA on load (staggered ~0.08s), sticker badge does a small rotate-in (from 0deg to its resting -3deg) with a spring.
- How-it-works + trust callout: `fadeRise` stagger on mount (not scroll-gated — see MASTER.md motion system note on why `whileInView` is avoided here).
- Pricing card: `fadeRise` on mount, plus `hoverLift` on the whole card.
- Final CTA band: `fadeRise` on mount.
