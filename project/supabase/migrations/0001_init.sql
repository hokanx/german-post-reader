-- German Post Letter Reader — v1 schema
-- see plan/database.md for the design rationale

create type public.app_language as enum ('en', 'ar', 'tr');
create type public.subscription_status as enum ('trialing', 'active', 'canceled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language public.app_language,
  subscription_status public.subscription_status not null default 'trialing',
  trial_letters_used int not null default 0,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table public.letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  raw_ocr_text text,
  summary text,
  deadlines jsonb not null default '[]'::jsonb,
  reply_draft text,
  risk_flags jsonb not null default '[]'::jsonb,
  language public.app_language not null,
  created_at timestamptz not null default now()
);

create index letters_user_id_created_at_idx on public.letters (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.letters enable row level security;

create policy "profiles: select own row"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own row"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "letters: select own rows"
  on public.letters for select
  using (auth.uid() = user_id);

create policy "letters: insert own rows"
  on public.letters for insert
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('letters', 'letters', false);

create policy "letters bucket: read own folder"
  on storage.objects for select
  using (bucket_id = 'letters' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "letters bucket: write own folder"
  on storage.objects for insert
  with check (bucket_id = 'letters' and (storage.foldername(name))[1] = auth.uid()::text);
