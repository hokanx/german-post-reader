# Plan: dashboard letter sorting

Implements the design at `docs/superpowers/specs/dashboard-letter-sorting.md`.

## tasks

1. **copy** — add `sortBy`, `sortNewest`, `sortOldest`, `sortDeadline` to the `dashboard` block in `src/lib/i18n/copy.ts` for EN, AR, TR (next to the existing `filter*` keys).
2. **sort section in `LetterFilters`** — extend `src/app/(app)/dashboard/letter-filters.tsx`: new `SortOption = "newest" | "oldest" | "deadline"` type, new `sortOption`/`onSortOptionChange` props, a second `role="radiogroup"` section (same `chipClasses` styling as the action-required group) rendered above or below the category section.
3. **wire into `LetterList`** — in `letter-list.tsx`: lift `sortOption` state (`useState<SortOption>("newest")`, default `"newest"`), apply after the existing `filteredLetters` `useMemo` in a second `useMemo` (`sortedLetters`) that:
   - `newest`/`oldest`: compares `created_at`
   - `deadline`: compares `soonestDeadline(letter.deadlines)?.date`, `null` sorted last, ties broken by `created_at desc`
   Render `sortedLetters` instead of `filteredLetters` in the list/empty-state check. Pass `sortOption`/`setSortOption` into `LetterFilters`.
4. **verify** — start dev server, screenshot dashboard with seeded letters (mixed deadlines / no deadlines) at 375px and 1440px, exercise all three sort options combined with existing filters, confirm RTL (Arabic) popover layout still correct, confirm focus-visible rings + 44px touch targets on new chips.
5. **commit** — `feat: dashboard letter sorting by upload date or soonest deadline`.

## notes

- no new server/DB work — `created_at` and `deadlines` are already fetched by `dashboard/page.tsx` and passed into `LetterList`.
- no URL/query persistence for sort state, matching the filter feature's precedent.
