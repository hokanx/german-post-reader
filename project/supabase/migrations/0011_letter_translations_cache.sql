-- Caches every (letter, language) translation Gemini has ever produced, so
-- switching en -> tr -> en no longer calls Gemini twice: the second switch
-- is a cache hit read off this table instead of a re-translation (which was
-- also translating an already-translated text, compounding quality drift).
-- The upload pipeline seeds the row for the letter's original analysis
-- language for free, since that content already exists at insert time.
create table public.letter_translations (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  language public.app_language not null,
  summary text not null,
  deadlines jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  payments jsonb not null default '[]'::jsonb,
  appointments jsonb not null default '[]'::jsonb,
  key_facts jsonb not null default '[]'::jsonb,
  reply_draft_translation text not null default '',
  created_at timestamptz not null default now(),
  unique (letter_id, language)
);

alter table public.letter_translations enable row level security;

create policy "letter_translations: select own rows"
  on public.letter_translations for select
  using (exists (
    select 1 from public.letters
    where letters.id = letter_translations.letter_id
      and letters.user_id = auth.uid()
  ));

create policy "letter_translations: insert own rows"
  on public.letter_translations for insert
  with check (exists (
    select 1 from public.letters
    where letters.id = letter_translations.letter_id
      and letters.user_id = auth.uid()
  ));

create policy "letter_translations: update own rows"
  on public.letter_translations for update
  using (exists (
    select 1 from public.letters
    where letters.id = letter_translations.letter_id
      and letters.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.letters
    where letters.id = letter_translations.letter_id
      and letters.user_id = auth.uid()
  ));
