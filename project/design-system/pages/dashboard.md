# Page brief: dashboard (`/dashboard`)

Inherits all tokens from `design-system/MASTER.md`. Authenticated shell, no marketing chrome.

## goal

Answer two questions instantly: "how many free letters do I have left?" and "what did I already upload?" — then get out of the way toward the one action that matters: upload another letter.

## section order

1. **Top bar** — wordmark, language indicator (current language as a small pill, not a full selector — changing language is a settings action, not a dashboard action for v1), log-out.
2. **Trial status banner** — chunky pill badge, full width, showing letters remaining ("2 of 3 free letters used"), hard border, saturated accent background. If subscribed (`subscription_status = 'active'`), this banner is replaced by a quieter "unlimited letters" pill (still styled, not hidden — the user should feel the upgrade paid off).
3. **Primary CTA** — large "Upload a letter" button/card, impossible to miss, above the letter list.
4. **Letter history list** — each row/card: upload date, first line of summary (truncated), a colored deadline chip if `deadlines` is non-empty (soonest date), click-through to `/letters/[id]`. Newest first.
5. **Empty state** (zero letters) — replaces the list section entirely: sticker-ornament graphic, "Upload your first letter" copy explaining the value (not just "no data"), CTA button (same target as the primary CTA above — the empty state's CTA is not redundant chrome, it's the CTA when the list truly has nothing to show and stands alone here).

## states (non-negotiable per app/CLAUDE.md)

- **loading** (`loading.tsx`): skeleton matching this exact layout — banner skeleton, CTA skeleton, 3 letter-row skeletons.
- **empty**: see above, via `EmptyState` component.
- **error** (`error.tsx`): `ErrorState` with retry — dashboard data fetch failing is rare but must not render a blank page.

## named blocks (shadcnblocks-skill)

- Letter history: a simple card-list block (not a data table — this is a consumer app, not an admin panel).
- Trial banner: build custom (pill-uppercase chip + progress-like framing) — no generic "usage meter" block fits the sticker aesthetic; simpler to hand-build per MASTER.md's chip_style.

## responsive

Single column at all widths (this isn't a data-dense dashboard — `column_layout: standard` per MASTER.md). Trial banner and CTA stack full-width on mobile; letter rows already stack.

## motion

- Letter history cards stagger in on mount (`stagger`, ~0.06s).
- Trial banner does a single `fadeRise` on mount, not on every re-render.
- Upload CTA gets `hoverLift`.
