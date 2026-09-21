-- PostHog is gated client-side on the `consent_analytics` cookie
-- (components/PosthogProvider.tsx), but trackServerEvent fires from contexts
-- that have no browser and therefore no cookie: the Stripe webhook
-- (subscription_started / subscription_canceled) and the account-deletion
-- server action (account_deleted). Those three events were captured for every
-- user, including users who pressed "deny" — while the privacy policy states,
-- in all five languages, that analytics run "only if you accepted the cookie
-- banner". That is a false statement in the policy and §25 TTDSG exposure.
--
-- Persisting the decision gives the server the same answer the browser has.
-- `false` is the correct default: opt-in means no recorded consent is no
-- consent, so an un-migrated user is never captured server-side.
alter table public.profiles
  add column if not exists analytics_consent boolean not null default false;

-- analytics_consent is the user's own preference, the same class as
-- language / full_name / postal_address — not a privilege column like
-- has_active_subscription or trial_letters_used. So it belongs inside the
-- column grant 0012 established, not outside it. GRANT is additive, so this
-- re-states the existing three and adds the fourth.
grant update (language, full_name, postal_address, analytics_consent)
  on public.profiles to authenticated;
