# Plan: Stripe billing implementation

Expands `docs/superpowers/specs/billing.md`.

1. **Stripe server client** — `src/lib/stripe.ts`: `new Stripe(env.STRIPE_SECRET_KEY)`, server-only (never imported client-side).
2. **checkout route** — `src/app/api/stripe/checkout/route.ts`: auth check, get-or-create Stripe customer (service client read/write on `profiles.stripe_customer_id`), create Checkout Session, return `{ url }`.
3. **portal route** — `src/app/api/stripe/portal/route.ts`: auth check, read `stripe_customer_id`, create billing portal session, return `{ url }`.
4. **webhook route** — `src/app/api/stripe/webhook/route.ts`: verify signature against raw body, handle `customer.subscription.updated` / `customer.subscription.deleted`, map Stripe status → our enum, update `profiles` via service client keyed on `stripe_customer_id`.
5. **PaywallModal** — `src/components/PaywallModal.tsx`: chunky modal/card, "FREE TRIAL ENDED" chip, "Subscribe Now" button calling `/api/stripe/checkout` and redirecting.
6. **wire into upload-form.tsx** — replace the static trial-limit block with `<PaywallModal />`.
7. **dashboard "Manage subscription" link** — small link in the "Unlimited letters" banner calling `/api/stripe/portal`.
8. **build check** — `npm run build`.
9. **webhook unit test** — `tests/stripe-webhook.spec.ts`: construct a real signed payload with a test webhook secret, POST it to the route, assert the `profiles` row updates.
10. **commit** — `feat: Stripe subscription billing (checkout, webhook, paywall)`.

## self-review (spec coverage)

- Checkout unlocks unlimited letters: step 2, 6. ✓
- Customer Portal for cancellation: step 3, 7. ✓
- Webhooks sync subscription_status: step 4, 9. ✓
- Paywall modal styled per MASTER.md: step 5. ✓
- No placeholders. ✓
