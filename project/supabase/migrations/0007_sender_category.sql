-- Powers the dashboard letter card's icon: a broad, fixed classification of
-- who sent the letter (Behörde, insurer, bank, landlord, utility, school,
-- delivery, or other). Set once by the analysis pipeline at upload time —
-- unlike summary/deadlines/risk_flags, it's a stable slug rather than
-- translated text, so it's never touched by translateLetter.
create type public.sender_category as enum (
  'authority', 'insurer', 'bank', 'landlord', 'utility', 'school', 'delivery', 'other'
);

alter table public.letters
  add column sender_category public.sender_category not null default 'other';
