# Design: Stripe subscription billing

Source: SPEC.md mvp scope "Stripe Checkout monthly subscription unlocks unlimited letters", CLAUDE.md Stripe rules. Implements BUILD_PROMPT.md step 05. Price point: €9.99/month, matching the landing page's pricing card (`project/src/components/landing/pricing.tsx`).

## flow

1. User hits the trial cap (`upload/actions.ts` already returns `TRIAL_LIMIT_REACHED`, currently rendered as a static message in `upload-form.tsx`). This step swaps that static message for a real `PaywallModal` with a working "Subscribe Now" button.
2. "Subscribe Now" POSTs to `/api/stripe/checkout`. The route: gets the current user (RLS client), reads/creates a Stripe Customer (stores `stripe_customer_id` on `profiles` via service client the first time), creates a Checkout Session (`mode: 'subscription'`, `line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }]`, `success_url: /dashboard?subscribed=true`, `cancel_url: /dashboard`), returns `{ url }`. Client redirects `window.location.href = url`.
3. User completes payment on Stripe's hosted page. Stripe fires `checkout.session.completed` (session mode subscription) and/or `customer.subscription.updated` — the webhook handler updates `profiles.subscription_status` regardless of which event arrives first, keyed off the subscription's own `status` field mapped to our enum (`active`/`trialing`/`canceled`; Stripe's `trialing`/`active` → our `active` since v1 has no Stripe-side trial, only our own free-letter-count trial).
4. `/api/stripe/webhook` verifies the signature (`stripe.webhooks.constructEvent` against the **raw** request body — Next.js route handlers get this via `await request.text()`, never `request.json()`, since JSON round-tripping changes byte-for-byte content the signature was computed over), handles `customer.subscription.updated` (map `status` → our enum) and `customer.subscription.deleted` (→ `canceled`), updates `profiles` via the **service-role** client keyed on `stripe_customer_id`.
5. Customer Portal (`/api/stripe/portal`) — a POST route returning a portal session URL for the current user's `stripe_customer_id`, so a subscribed user can cancel/manage billing. Linked from the dashboard's "Unlimited letters" banner (a small "Manage subscription" link).
6. Posthog events (wired in step 06, not this step — Posthog isn't initialized yet): `trial_limit_reached` (paywall modal open), `subscription_started` (webhook success), `subscription_canceled` (subscription.deleted webhook). This step adds the call sites as `posthog?.capture(...)` no-ops guarded by a check for whether posthog is initialized, so step 06 wiring it up doesn't require touching this code again.

## why the checkout/portal/webhook routes use different clients

- `/api/stripe/checkout` and `/api/stripe/portal`: read the current user via the RLS-scoped server client (need to know *who's* checking out), but write `stripe_customer_id` via the service-role client (no client-side update policy exists on `profiles`, by design — see `plan/database.md`).
- `/api/stripe/webhook`: has no user session at all (Stripe calls it directly, server-to-server) — everything here goes through the service-role client, keyed by `stripe_customer_id` rather than a session user id.

## paywall modal

`src/components/PaywallModal.tsx` — rendered by `upload-form.tsx` when `uploadLetter` returns `TRIAL_LIMIT_REACHED` (already wired from step 03, just swapping the static block for this component). Styled per MASTER.md: chunky card, hard border, coral/accent CTA button, pill-uppercase "FREE TRIAL ENDED" chip (already exists in the current static block — this step makes the button functional instead of decorative).

## webhook local testing

Since there's no live Stripe account connected yet, the webhook handler is implemented and unit-testable via a hand-crafted signed payload (see `tests/stripe-webhook.spec.ts`) rather than the Stripe CLI's `listen` forwarding, which needs real Stripe credentials neither BUILD_PROMPT nor the user has provided yet.

## ambiguity SPEC.md leaves open

SPEC.md doesn't specify how cancellation should reflect in the UI immediately after webhook processing (there's a delay between clicking "cancel" in the Portal and the webhook landing). Decision: no special handling — the dashboard reads `subscription_status` fresh on every load, so it reflects the correct state as soon as the webhook lands, same as any other webhook-driven state in this app (e.g. Vercel or GitHub billing pages behave the same way).
