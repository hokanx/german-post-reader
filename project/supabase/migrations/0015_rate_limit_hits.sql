-- Backs app-level rate limiting on login, signup, and upload (security audit
-- finding, 2026-08-23: no rate limiting existed anywhere, and the upload
-- route triggers a real Gemini API call per request with no per-IP throttle).
-- One row per attempt; a window's hit count is a COUNT(*) over `key` within
-- the lookback period, read/written only via the service-role client
-- (lib/rate-limit.ts) — RLS is enabled with no policies so anon/authenticated
-- have zero access, matching the default-deny shape used everywhere else in
-- this schema.
create table public.rate_limit_hits (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_key_created_at_idx on public.rate_limit_hits (key, created_at desc);

alter table public.rate_limit_hits enable row level security;
