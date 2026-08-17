-- Every payment amount or payment change the letter states (amount owed,
-- a new/changed fee, an installment) — pulled into its own guaranteed
-- field instead of only maybe surfacing inside the general-purpose
-- key_facts array, since a missed payment amount is the highest-stakes
-- kind of miss this app can make. Defaults to an empty array so existing
-- rows analyzed before this field existed render with no payment section
-- rather than a null-handling error.
alter table public.letters
  add column payments jsonb not null default '[]'::jsonb;
