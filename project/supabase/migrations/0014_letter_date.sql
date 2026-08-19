-- The date printed on the letter itself (e.g. "München, den 15.03.2026") --
-- distinct from `created_at`, which is when the user uploaded it to
-- Papkram, not when the sender issued the letter. Nullable: not every
-- letter states a date Gemini can confidently read, and existing rows
-- analyzed before this column existed have no value to backfill.
alter table public.letters add column letter_date text;
