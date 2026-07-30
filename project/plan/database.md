# Database plan — Supabase schema (v1)

Source: SPEC.md mvp scope + BUILD_PROMPT.md step 01 sub-step 4. Two tables, two enums, RLS on both, one private storage bucket.

## enums

```sql
create type public.app_language as enum ('en', 'ar', 'tr');
create type public.subscription_status as enum ('trialing', 'active', 'canceled');
```

## table: profiles

One row per authenticated user, 1:1 with `auth.users`.

| column | type | notes |
|---|---|---|
| id | uuid | PK, FK → `auth.users.id`, `on delete cascade` |
| language | app_language | nullable — null until onboarding language step completes |
| subscription_status | subscription_status | not null, default `'trialing'` |
| trial_letters_used | int | not null, default `0` |
| stripe_customer_id | text | nullable, set on first checkout |
| created_at | timestamptz | not null, default `now()` |

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language public.app_language,
  subscription_status public.subscription_status not null default 'trialing',
  trial_letters_used int not null default 0,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);
```

A profile row is created by the signup server action immediately after `auth.signUp` succeeds (application-level insert, not a DB trigger — keeps the welcome-email side effect and the insert in the same server action for simpler error handling).

## table: letters

One row per uploaded letter + its analysis.

| column | type | notes |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| user_id | uuid | FK → `profiles.id`, `on delete cascade` |
| storage_path | text | not null — `{user_id}/{letter_id}` in the `letters` bucket |
| raw_ocr_text | text | nullable — never shown to the user directly, pipeline input only |
| summary | text | nullable until analysis completes |
| deadlines | jsonb | not null, default `'[]'` — array of `{date, description}` |
| reply_draft | text | nullable until analysis completes |
| risk_flags | jsonb | not null, default `'[]'` — array of strings |
| language | app_language | not null — the language analysis was generated in |
| created_at | timestamptz | not null, default `now()` |

```sql
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
```

## RLS

```sql
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
```

No `insert` policy on `profiles` (rows are created server-side with the service role key, bypassing RLS, right after signup — never from the client). No `update`/`delete` policy on `letters` (letters are immutable once analyzed; the pipeline writes them once via the service role key during the upload server action).

## storage bucket: `letters`

- Private bucket, authenticated access only, no public URL.
- Path convention: `{user_id}/{letter_id}` (matches `letters.storage_path`).
- Storage RLS: users can read/write only under their own `{user_id}/` prefix.

```sql
insert into storage.buckets (id, name, public)
values ('letters', 'letters', false);

create policy "letters bucket: read own folder"
  on storage.objects for select
  using (bucket_id = 'letters' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "letters bucket: write own folder"
  on storage.objects for insert
  with check (bucket_id = 'letters' and (storage.foldername(name))[1] = auth.uid()::text);
```

## why service-role reads for the analysis pipeline

Trial-limit enforcement (`trial_letters_used`, `subscription_status`) and the letters insert happen inside the upload server action using the **service role key**, not the user's session client — the RLS policies above are the client-side floor (a user can never read someone else's data even if a bug elsewhere leaks a query), but the server action is the place that actually enforces the business rule of "3 free letters," which must never be trusted to a client-supplied count.
