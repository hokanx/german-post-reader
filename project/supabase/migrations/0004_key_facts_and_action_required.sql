-- Adds the two fields the redesigned letter-detail and dashboard screens need:
-- key_facts powers the "Where this comes from" citation list (each fact paired
-- with its own German source quote), action_required powers the dashboard's
-- Action-needed / No-action pill. Both default so existing rows analyzed under
-- the old schema remain valid (empty citations, no action flagged) rather than
-- needing a backfill.
alter table public.letters add column key_facts jsonb not null default '[]'::jsonb;
alter table public.letters add column action_required boolean not null default false;
