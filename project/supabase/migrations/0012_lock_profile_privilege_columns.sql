-- The "profiles: update own row" RLS policy (0001_init.sql) only checks row
-- ownership (auth.uid() = id), not which columns are writable. Since the
-- public anon key plus a user's own session JWT can reach PostgREST
-- directly — the standard, intended way any Supabase client talks to the
-- database, nothing to do with the app's own code — any authenticated user
-- could previously PATCH their own has_active_subscription,
-- trial_letters_used, or stripe_customer_id directly, bypassing Stripe
-- entirely (security audit finding, 2026-08-18).
--
-- Column-level privileges close this: `authenticated` can now UPDATE only
-- the columns the app's own client-scoped code legitimately writes
-- (language, full_name, postal_address — see lib/profile/actions.ts).
-- Billing/trial fields stay writable only by the service-role client
-- (lib/supabase/service.ts), which bypasses table grants entirely — matches
-- how upload/actions.ts and the Stripe webhook already write them.
revoke update on public.profiles from anon, authenticated;
grant update (language, full_name, postal_address) on public.profiles to authenticated;
