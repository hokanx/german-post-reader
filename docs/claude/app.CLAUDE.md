# app/CLAUDE.md — routing + required states

scoped rules for the route tree. Next.js App Router conventions assumed (adapt names if the stack differs).

## every data-backed route ships three states (NON-NEGOTIABLE)
- `loading.tsx` — a **skeleton** matching the real layout (not a bare spinner unless the wait is <300ms).
- `error.tsx` — an `'use client'` boundary showing the **specific** cause + a recovery action (a retry button calling `reset()`). NEVER "Something went wrong."
- `not-found.tsx` — for routes that fetch a single record by id, when it's missing.
- the **empty** state (zero rows) is handled in the page/component via `EmptyState` (see components/CLAUDE.md).

a route is not done until empty, loading, and error all exist and were each screenshotted by `/design-review`.

## conventions
- Server Components by default. add `'use client'` only for interactivity (state, effects, browser APIs, framer-motion).
- fetch in Server Components / route handlers; never leak secrets to the client.
- per-route `metadata` (title + description) on every page.
- mutations use Server Actions or route handlers that return the lib error envelope — not raw throws to the client.
