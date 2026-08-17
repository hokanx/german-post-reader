/**
 * Single source of truth for the free trial limit — previously duplicated as
 * a literal `3` across upload/actions.ts, dashboard/page.tsx, and ~9 hardcoded
 * UI/email strings with no shared constant (a real drift risk found while
 * changing this number to 4).
 */
export const FREE_LETTER_LIMIT = 4;

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
