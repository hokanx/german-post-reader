# Design principles — the bar every page must clear

Inspired by Stripe, Airbnb, and Linear. This is the universal quality bar the `design-review` subagent grades against. The project's SPECIFIC tokens (fonts, palette, radius, density, motion) are LOCKED in `design-system/MASTER.md` and SPEC.md's design direction — this doc is the craft standard on top of them.

## I. Philosophy
- **Users first, meticulous craft, speed.** Every element is intentional. Fast load, snappy interaction.
- **Clarity over cleverness.** Unambiguous labels, one primary action per screen, minimal cognitive load.
- **Consistency.** One design language — colors, type, spacing, components — everywhere.

## II. Visual hierarchy & layout
- A clear focal point on every screen; type scale + spacing + color guide the eye.
- Generous, consistent white space on an 8px spacing rhythm. Consistent alignment.
- Responsive at 1440 / 768 / 375 — no horizontal scroll, no overlap, touch targets >= 44px.

## III. Accessibility (WCAG 2.1 AA — graded from the accessibility tree)
- Semantic HTML and landmarks; heading levels never skip.
- Every interactive element keyboard-operable with a visible focus-visible ring (uses `--ring`).
- Every control has an accessible name; every input a label; every image alt text.
- Body contrast >= 4.5:1 (>= 3:1 for large text), verified independently in light AND dark.

## IV. Interaction & motion
- Micro-interactions on hover/active/focus; feedback is immediate (150-300ms, eased).
- Motion present, not absent (framer-motion) — and gated behind `prefers-reduced-motion`.
- Smooth transitions for overlays, route changes, and state changes. Motion serves usability, never distracts.

## V. Required states (every data view)
- **Empty:** explains why it's empty, the value when full, and one clear CTA. Never a blank box.
- **Loading:** skeleton matching the eventual layout (a bare spinner only for <300ms waits).
- **Error:** the specific cause + a recovery action. NEVER a generic "Something went wrong."

## VI. Content
- Real, on-topic copy and microcopy. No lorem ipsum, no "Card Title", no placeholder filler.

## VII. The screenshot-artifact iron law
- A page is reviewed on the LIVE rendered page, never from source code.
- A PASS is invalid unless a screenshot artifact physically exists at `artifacts/review/<page>.png`. If the browser disconnected and no file was written, the verdict is FAIL — full stop.
