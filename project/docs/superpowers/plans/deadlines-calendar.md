# Plan: deadlines calendar view

Implements the design at `docs/superpowers/specs/deadlines-calendar.md`.

## tasks

1. **`locale.ts`** — add `src/lib/letters/locale.ts` exporting `appLanguageToLocale(language: AppLanguage): string` (`ar` -> `"ar-EG"`, `tr` -> `"tr-TR"`, else `"en-GB"`). Update `group-deadlines-by-month.ts`'s caller (`deadlines/page.tsx`) and the new calendar code to use it instead of the inline ternary.
2. **`group-deadlines-by-day.ts`** — pure function `groupDeadlinesByDay(deadlines: FlatDeadline[]): Record<string, FlatDeadline[]>`, keyed by the ISO date, only for entries matching `ISO_DATE_RE`. Add `group-deadlines-by-day.test.ts` mirroring `group-deadlines-by-month.test.ts`'s hand-rolled assert style (multiple deadlines same day grouped together; non-ISO entries excluded; empty input -> `{}`).
3. **`build-calendar-weeks.ts`** — pure function `buildCalendarWeeks(monthStart: Date): { iso: string; inCurrentMonth: boolean }[][]`. Monday-start weeks, always 6 rows (42 cells) so the grid height never jumps between months. Add `build-calendar-weeks.test.ts`: first week contains the correct Monday-aligned padding for a month starting mid-week (e.g. March 2026 starts on a Sunday), last week pads into next month, `inCurrentMonth` flags correct, iso strings correct.
4. **copy** — add `prevMonth`, `nextMonth`, `todayLabel`, `deadlineCountOnDay: (n) => string` to the `deadlines` block in `src/lib/i18n/copy.ts` for EN, AR, TR, plus the matching type entries.
5. **`deadlines-calendar.tsx`** — new client component under `src/app/(app)/deadlines/`:
   - `useState` for `viewedMonth` (init: month of `deadlinesByDay`'s earliest key >= today if any, else current month) and `selectedDay` (reset via a `useEffect`/derived reset whenever `viewedMonth` changes).
   - Header row: `Today` button (`todayLabel`), month/year label, prev/next `ChevronLeft`/`ChevronRight` icon buttons (`aria-label` from `prevMonth`/`nextMonth`), 44px touch targets, focus-visible rings.
   - `dir="ltr"` wrapper around the grid only (not the header/undated list, which follow the page's `dir`).
   - Weekday header row via `Intl.DateTimeFormat(locale, { weekday: "short" })` over a fixed reference week (e.g. `2024-01-01` Monday + 0..6 days).
   - Grid: `buildCalendarWeeks(viewedMonth)`, each cell looks up `deadlinesByDay[iso]`. 0 deadlines -> `<span>` (dimmed if `!inCurrentMonth`). 1+ deadlines -> `<button>` wrapped in `Popover`/`PopoverTrigger` (see `letter-filters.tsx` for the established pattern), count badge, `aria-label={copy.deadlineCountOnDay(count)}`, today gets a ring (`isSameDay` against `new Date()`), selected gets `bg-primary`.
   - `PopoverContent`: `dir` matches page language; lists `deadlinesByDay[selectedIso]`, each a `Link` to `/letters/${d.letterId}#deadlines` with `d.description` / `d.letterSummary`, same text styling as the current flat-list card minus the date pill.
6. **`deadlines/page.tsx`** — replace the flat-list render: split `flattenAndSortDeadlines` output into ISO/non-ISO (reuse the file's existing `ISO_DATE_RE`), call `groupDeadlinesByDay` on the ISO subset, render `<DeadlinesCalendar deadlinesByDay={...} language={language} copy={...} />` above an (unchanged-style) undated-deadlines list section for the non-ISO subset (only rendered if non-empty). `EmptyState` still covers the true zero-deadlines case.
7. **`deadlines/loading.tsx`** — swap the 3-row skeleton for a calendar-shaped one: header-bar skeleton + a 7-column grid of small square skeletons (6 rows), matching the real layout per the loading-state rule.
8. **verify** — start dev server, seed/exercise an account with letters that have: multiple deadlines on one day, deadlines in different months, a non-ISO deadline, zero deadlines. Screenshot the calendar at 375px and 1440px, open a day popover, click through to a letter, navigate prev/next month and via Today, confirm Arabic (`dir="rtl"` page / `dir="ltr"` grid) and Turkish render correctly, confirm focus-visible rings and 44px touch targets on all new interactive elements. Run `npx tsc --noEmit`.
9. **commit** — `feat: real calendar view for /deadlines with day-selection popover`.

## notes

- No new server/DB work — `deadlines/page.tsx` already fetches everything needed.
- No URL/query persistence for `viewedMonth`/`selectedDay`, consistent with the dashboard filter/sort precedent (local component state only).
- Run the two new `.test.ts` files directly with `npx tsx <file>`, matching the existing sibling tests (no test-runner config in this repo for unit-style `.test.ts` files).
