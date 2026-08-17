-- The sender's name as printed on the letter (e.g. "Finanzamt München"),
-- extracted as its own field so the letter-detail page can show a
-- dedicated "from" section instead of relying on parsing it back out of
-- the free-text summary. Nullable: existing rows analyzed before this
-- field existed have no value, and the UI skips the section when unset
-- rather than backfilling a guess. Never translated, same as
-- sender_category — an org name doesn't change with the UI language.
alter table public.letters
  add column sender_name text;
