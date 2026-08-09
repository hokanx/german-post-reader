# Landing Offer Rewrite (Value Stack + Bonuses)

**Date:** 2026-08-09
**Status:** approved, ready for implementation planning

## Context

An audit against `DNA PAPKRAM.pdf` (the product's direct-response marketing
brief) found the current landing page (`src/app/page.tsx` +
`src/components/landing/`) covers the product mechanics correctly but none
of DNA's offer-stack persuasion layer: no bonuses, no value anchoring, no
named methodology. No LANDING or VSL document exists anywhere in the repo —
this spec is DNA-vs-app only.

DNA's full offer touches five largely independent pieces (mechanism
branding, value-stack pricing, a Founder's Circle scarcity counter, a
financial guarantee, and bonus content), decomposed with the user into
A–E. **This spec covers only piece A: the landing page's value-stack
pricing and bonuses section.** B (live founder counter), C (guarantee — cut
from scope, see below), D (real bonus content), and E (VSL) are separate,
later specs.

Confirmed with the user:

- **No named mechanism/protocol.** DNA proposes branding the AI pipeline
  ("The DECODE Protocol", "Regulatory Intent Decoding", etc.). Declined —
  the product keeps plain-language descriptions, no invented methodology
  name anywhere in copy.
- **Guarantee: removed entirely**, not deferred. DNA's "No Fines, No
  Penalties" guarantee (refund + cover fines up to €250) is a real
  financial/legal commitment requiring a claims process and ToS language
  that doesn't exist. The user cut it rather than defer it — it is not
  part of this offer at all, in this round or a future one, unless
  explicitly revisited.
- **Bonuses are marketing/demonstration copy**, explicitly. The
  Bureaucracy Toolkit and Urgent Phrases Guide are advertised as included
  benefits with no real content or in-app delivery built in this round
  (that's future item D). No links to non-existent pages are added.
- **Founder's Circle is the one bonus with real, honored terms**, not
  decorative: founding subscribers get priority/exclusive support access,
  their price locked at `SUBSCRIPTION_PRICE_EUR` for life even if the
  price rises for later cohorts, and all future features/updates included
  free forever. The "first 100 spots" scarcity number is a **static
  badge** in this round — no live counter (that's item B).
- **All copy ships in English, Arabic, and Turkish** at once, matching the
  existing `MARKETING_COPY` per-locale pattern (including RTL for Arabic).

**Flagged, not blocking:** DNA's literal "Standalone Value: €97 / €197 /
€47 / €27" table invents per-item market prices with no independent basis
— a recognized deceptive-pricing pattern, and this product markets to
people navigating German consumer-protection bureaucracy specifically.
This spec keeps DNA's numbers but reframes the column as **"what you'd pay
elsewhere"** (a cost-of-alternatives comparison) rather than a bare
"standalone value" claim — same persuasive structure, more defensible
framing.

## Scope

**In scope:**
- A value-stack section replacing the current simple pricing card
- A bonuses section (3 cards)
- Full EN/AR/TR copy for both

**Explicitly out of scope for this spec:** guarantee (cut), live founder
counter (item B), real Toolkit/Phrases Guide content (item D), VSL (item
E, undecided format).

## 1. Copy data model

Extend `MarketingCopy` in `src/components/landing/copy.ts` with two new
blocks per locale, following the existing pattern (plain strings /
parameterized functions like `pricing.badge(n)`):

```ts
offer: {
  heading: string;
  items: { name: string; description: string; comparisonCost: string }[]; // the 4 real deliverables
  bonuses: { name: string; description: string; comparisonCost: string }[]; // the 3 bonuses, same shape, folded into the same table
  totalComparisonLabel: string;   // e.g. "What you'd pay elsewhere"
  totalComparisonValue: string;   // formatted, e.g. "€368.00"
  priceLabel: string;             // e.g. "Your price"
  cta: string;
};
bonuses: {
  heading: string;
  items: {
    name: string;        // "Founder's Circle" / "Bureaucracy Toolkit" / "Urgent Phrases Guide"
    badge?: string;       // only Founder's Circle gets the static "first 100" badge
    description: string;
  }[];
};
```

The existing `pricing` block in `MarketingCopy`/`MARKETING_COPY` is
removed (superseded by `offer`), not kept alongside it — one pricing
source of truth on the page.

## 2. `ValueStack` component

Replaces `src/components/landing/pricing.tsx` — rename the file and the
exported component to `value-stack.tsx` / `ValueStack`, update the single
import in `page.tsx`.

Layout: same card shell already proven in `/design-review` (`border-2
border-border bg-card`, hard-offset shadow `shadow-[6px_6px_0_0_var(--border)]`,
pill-uppercase badge), extended to hold:

1. Heading (`offer.heading`)
2. A stacked list of the 4 real deliverables + 3 bonuses, each row:
   name, one-line description, comparison cost (right-aligned, muted)
3. A struck-through total (`totalComparisonValue`) next to
   `totalComparisonLabel`
4. The real price, reusing `formatEur(SUBSCRIPTION_PRICE_EUR)` and the
   existing `priceSuffix`-style free-trial framing (`FREE_LETTER_LIMIT`
   free letters first, from `src/lib/constants.ts` — unchanged, no new
   constants)
5. CTA button → `/signup` (unchanged behavior)

No new colors/fonts/radii — this is a content/layout extension of an
already-approved card pattern, not a new visual language.

## 3. `Bonuses` component (new)

New file `src/components/landing/bonuses.tsx`. Three cards in a row
(stacking on mobile, matching the existing `HowItWorks` 3-step responsive
pattern):

- **Founder's Circle** — static pill badge ("First 100 founding
  members"), body copy stating the three real terms plainly: priority
  support access, price locked for life, all future updates included
  free. No em-dash-stacked hype language — state it as policy, since it
  is one.
- **Bureaucracy Toolkit** — description only, no link, no CTA (nothing to
  click through to yet).
- **Urgent Phrases Guide** — description only, same treatment.

## 4. Page composition

`src/app/page.tsx` order becomes:

```
Nav → Hero → HowItWorks → TrustCallout → ValueStack → Bonuses → CtaBand → Footer
```

(`Pricing` import replaced by `ValueStack`; `Bonuses` newly inserted
before `CtaBand`.)

## Error handling

None needed — this is static marketing copy with no data fetching, no
user input, no new server actions. Existing locale-switch behavior
(`useMarketingLocale`) is reused unchanged.

## Testing / verification plan

- Typecheck + production build.
- Screenshot the landing page in all three languages at 375px and 1440px
  via chrome-devtools, per the existing pattern in `artifacts/review/`.
- Compare against `artifacts/golden.png` and run the `/design-review` gate
  before considering this done, per `CLAUDE.md`'s design-review gate.
- Confirm Arabic renders `dir="rtl"` correctly through the new sections
  (existing `copy.dir` pattern, no new RTL logic needed).

## Forward-looking notes (not built now)

- **Price-lock enforcement**: honoring "Founder's Circle price never
  changes" requires that whenever `SUBSCRIPTION_PRICE_EUR` is raised for
  new subscribers in the future, existing Founder's Circle subscribers
  must stay on their original Stripe price (e.g. a distinct Stripe Price
  ID per cohort, or per-customer price override). No second price exists
  yet, so nothing to build today — flagging so it isn't forgotten when
  pricing changes are eventually made.
- **Item B** (live founder counter), **item D** (real Toolkit/Phrases
  Guide content + delivery), and **item E** (VSL) remain open, separately
  scoped work, not scheduled here.
- **The guarantee is cut, not deferred** — if it's ever reconsidered, it
  needs its own spec covering claims process and ToS changes before any
  copy goes live.
