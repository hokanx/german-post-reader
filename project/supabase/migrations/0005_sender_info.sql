-- Lets a user store their own name and postal address once in Settings, so
-- reply drafts can use it as the real letterhead instead of Gemini falling
-- back to a bracketed placeholder like "[Ihr Name], [Ihre Adresse]" every
-- time. Both nullable with no default — most existing accounts won't have
-- filled this in yet, and the reply pipeline already handles the "not
-- provided" case (it did before this column existed too).
alter table public.profiles add column full_name text;
alter table public.profiles add column postal_address text;
