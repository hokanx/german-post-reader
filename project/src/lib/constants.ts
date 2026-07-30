/**
 * Single source of truth for the free trial limit — previously duplicated as
 * a literal `3` across upload/actions.ts, dashboard/page.tsx, and ~9 hardcoded
 * UI/email strings with no shared constant (a real drift risk found while
 * changing this number to 4).
 */
export const FREE_LETTER_LIMIT = 4;

/** One-time payment for unlimited letters — not a subscription (see CLAUDE.md Stripe rules). */
export const UNLIMITED_PRICE_EUR = "5.99";
