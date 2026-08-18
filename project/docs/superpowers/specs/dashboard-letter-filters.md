# Design: dashboard letter filters

Per SPEC.md mvp scope: "Dashboard letter filters — by action-required status and by sender category — work."

## approach

Client-side filtering inside the existing `LetterList` client component. Letter counts are bounded by `FREE_LETTER_LIMIT`/`DAILY_LETTER_LIMIT`, so the dashboard already fetches the user's full letter set server-side in one query — no new query params, no server round-trip, no URL state needed for a set this small.

Add a filter bar above the list:
- an action-required segmented toggle: All / Action needed / No action (uppercase pill chips, matches `chip_style: pill-uppercase`)
- a sender-category multi-select using the existing `SENDER_CATEGORY_ICONS` + `senderCategories` copy, same pill style, toggle-on-click
- filters combine with AND; both default to "no filter applied" (show everything)
- filtered-to-zero-results reuses `EmptyState` with a distinct copy string ("no letters match these filters") and a "clear filters" action instead of the upload CTA
- filter state is local component state (`useState`), reset on page reload — no persistence, consistent with the size of this feature

New `APP_COPY.dashboard` keys per language (EN/AR/TR): `filterAll`, `filterActionNeeded`, `filterNoAction`, `filterByCategory`, `filterEmptyTitle`, `filterEmptyDescription`, `clearFilters`.
