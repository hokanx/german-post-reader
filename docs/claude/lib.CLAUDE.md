# lib/CLAUDE.md — data layer

scoped rules for data access, seeds, and shared utilities.

## seed data (real content, never lorem ipsum)
- the Faker seed script lives at `lib/seed/seed.ts` and generates ~20 realistic rows per entity in SPEC.md.
- seed with believable, on-topic names plus Faker-generated siblings — never "Item 1" / lorem ipsum.
- run it to populate local/dev data; UI is always built against realistic seed data, so empty states are deliberate (forced), not the default you happen to see.

## error envelope (one shape everywhere)
- data-access functions never throw raw errors to the UI. they return a typed result:
  `type Result<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string; recovery?: string } }`
- `message` is human and specific; `recovery` tells the user what to do. the UI's `ErrorState` renders these — that's how we avoid "Something went wrong."

## conventions
- one module per entity / concern; keep files focused.
- env access is centralized (a single `env.ts` that validates with zod) — never scatter `process.env` reads.
- types are the source of truth; derive, don't duplicate.
