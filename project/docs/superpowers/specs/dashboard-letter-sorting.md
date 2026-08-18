# Design: dashboard letter sorting

Per SPEC.md mvp scope: "Dashboard letter sorting — by upload date (newest/oldest) or by soonest deadline — works."

## approach

Client-side sorting inside the existing `LetterList` client component, extending the filter bar shipped in `docs/superpowers/specs/dashboard-letter-filters.md` — same reasoning applies: the dashboard already fetches the user's full letter set server-side (`created_at desc`) in one query, so no new query params or server round-trip are needed.

Add a "Sort by" section to the existing `LetterFilters` popover (not a second control) — it's already the compact home for dashboard-list controls after `59c8edf` collapsed filters into one popover trigger:

- a segmented radiogroup, same pill style as the action-required filter: **Newest first** (default) / **Oldest first** / **Soonest deadline**
- `newest` / `oldest` sort by `created_at`
- `deadline` sorts by each letter's soonest deadline date ascending (reusing the existing `soonestDeadline` helper in `letter-list.tsx`); letters with no deadline sort to the end, in `created_at desc` order among themselves
- sorting is applied to the already-filtered list, right before render
- sort state is local component state (`useState`, default `"newest"`), reset on page reload — no persistence, consistent with filter state
- the popover's active-count badge only reflects filters (not sort), since sort always has a value and isn't a "filter applied" signal — but a non-default sort still surfaces via the visible selected pill when the popover is open

New `APP_COPY.dashboard` keys per language (EN/AR/TR): `sortBy`, `sortNewest`, `sortOldest`, `sortDeadline`.

## edge case

A letter can have `deadlines: []` or `null` — both treated as "no deadline" and sorted last, matching `soonestDeadline`'s existing null-safe behavior.
