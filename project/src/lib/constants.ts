/**
 * Single source of truth for the free trial limit — previously duplicated as
 * a literal `3` across upload/actions.ts, dashboard/page.tsx, and ~9 hardcoded
 * UI/email strings with no shared constant (a real drift risk found while
 * changing this number to 4).
 */
export const FREE_LETTER_LIMIT = 4;

/**
 * Pre-launch switch: true hides the paywall and Stripe checkout from the
 * UI entirely (accounts unlock a free demo instead), false restores real
 * selling. Stripe's checkout/webhook/portal code, PaywallModal, and every
 * Stripe env var are left completely untouched either way — this flag only
 * changes which UI branch renders. Flip to false when ready to sell; no
 * rebuild needed.
 */
export const DEMO_MODE = true;

/** Yearly subscription price for unlimited letters (see CLAUDE.md Stripe rules). */
export const SUBSCRIPTION_PRICE_EUR = "29.99";

/** Monthly subscription price — same unlimited access, billed per month. */
export const SUBSCRIPTION_PRICE_MONTHLY_EUR = "3.99";

/**
 * Soft daily cap on letters for subscribed ("unlimited") users. Gemini cost
 * per letter is near-zero, so this isn't a cost-control lever at normal
 * usage — it's a backstop against a bug or a single bad actor turning
 * "unlimited" into a real bill. Set well above any real user's usage.
 */
export const DAILY_LETTER_LIMIT = 30;

/**
 * Vercel's serverless functions have a hard 4.5MB request body ceiling that
 * no Next.js config can raise (docs.vercel.com/docs/errors/function_payload_too_large).
 * Shared by the client-side pre-check (upload-form.tsx) and the server
 * action's own enforcement (upload/actions.ts) — the client check is a UX
 * nicety only; the server check is the real boundary, since a request can
 * always bypass client-side JavaScript entirely.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
