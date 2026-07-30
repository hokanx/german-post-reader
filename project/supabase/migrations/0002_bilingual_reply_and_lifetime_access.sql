-- Reply drafts must be sent in German (the recipient reads German), with a
-- translation so the user understands what they're sending. detected_language_confirmed
-- was already requested from Gemini but never persisted or surfaced — added
-- here so the analysis page can show a confidence note.
alter table public.letters add column reply_draft_translation text;
alter table public.letters add column detected_language_confirmed boolean not null default true;

-- Pricing moved from a monthly subscription to a one-time payment for
-- unlimited access (the app runs on Gemini's free tier, so there's no
-- recurring cost to pass on). subscription_status's three-state enum
-- (trialing/active/canceled) no longer applies — a one-time purchase can't
-- be "canceled". Replaced with a single boolean, which also removes the bug
-- where a lapsed "canceled" user's trial limit was never enforced because
-- the upload check only ever looked for "trialing".
alter table public.profiles add column has_lifetime_access boolean not null default false;
update public.profiles set has_lifetime_access = true where subscription_status = 'active';
alter table public.profiles drop column subscription_status;
drop type public.subscription_status;
