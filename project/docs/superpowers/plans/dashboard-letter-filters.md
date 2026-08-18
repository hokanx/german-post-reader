# Plan: dashboard letter filters

Implements the design at `docs/superpowers/specs/dashboard-letter-filters.md`.

## tasks

1. **copy** — add `filterAll`, `filterActionNeeded`, `filterNoAction`, `filterByCategory`, `filterEmptyTitle`, `filterEmptyDescription`, `clearFilters` to the `dashboard` block in `src/lib/i18n/copy.ts` for EN, AR, TR.
2. **filter bar component** — new `src/app/(app)/dashboard/letter-filters.tsx` (client component): action-required segmented toggle (All/Action needed/No action) + sender-category pill multi-select, pill-uppercase styling matching existing badges in `letter-list.tsx`. Emits filter state up via props (controlled from `LetterList`).
3. **wire into `LetterList`** — lift filter state into `letter-list.tsx` (`useState` for `actionFilter: "all" | "required" | "none"` and `categoryFilter: Set<SenderCategory>`), render `LetterFilters` above the `<ul>`, filter the `letters` array before mapping. When filtered result is empty, render `EmptyState` with `filterEmptyTitle`/`filterEmptyDescription` copy and a `clearFilters` action instead of the upload CTA.
4. **verify** — start dev server, screenshot dashboard with letters at 375px and 1440px, toggle each filter combination, confirm RTL (Arabic) renders correctly, confirm focus-visible rings + 44px touch targets on filter chips, confirm empty-filtered-state path.
5. **commit** — `feat: dashboard letter filters by action-required and sender category`.

## notes

- no new server/DB work — `action_required` and `sender_category` are already fetched by `dashboard/page.tsx` and passed into `LetterList`.
- no URL/query persistence for filter state (matches design doc — scope stays small).
