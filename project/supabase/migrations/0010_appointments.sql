-- Every fixed date/time the recipient must physically be present for
-- (an inspection, a hearing, a medical appointment) — distinct from
-- deadlines, which are dates to act by with no attendance required.
-- Same treatment as payments: its own guaranteed field with a dedicated
-- section, rather than only maybe surfacing as a generic deadline.
alter table public.letters
  add column appointments jsonb not null default '[]'::jsonb;
