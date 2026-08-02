-- Switched from a one-time €5.99 unlock to a €5.99/year subscription — a
-- recurring charge keeps revenue matched to ongoing Gemini usage instead of
-- a single payment covering unlimited use forever. has_lifetime_access is
-- renamed (not re-typed) since the boolean semantics are the same: true
-- while the user has paid access, flipped by whichever Stripe event fires
-- (checkout before, subscription lifecycle now).
alter table public.profiles rename column has_lifetime_access to has_active_subscription;
