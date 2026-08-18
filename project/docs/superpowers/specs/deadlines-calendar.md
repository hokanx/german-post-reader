# Design: deadlines calendar view

Per SPEC.md mvp scope: "The /deadlines page renders a real calendar view (not a flat list); selecting a day opens a bubble/popover listing that day's letters with deadlines works."

## approach

Replace the flat month-grouped list in `/deadlines` (`deadlines/page.tsx`) with a month-grid calendar. The page already fetches every letter's `deadlines` server-side in one query and flattens+sorts them via `flattenAndSortDeadlines` — that data source doesn't change; only the rendering does.

- Split the flattened deadlines into ISO-dated (`ISO_DATE_RE` test, same regex already duplicated per-file in this codebase) and non-ISO (relative/free-text, e.g. "innerhalb von 14 Tagen"). ISO-dated ones drive the calendar grid; non-ISO ones can't be placed on a grid and stay as a simple list section below it, headed by the existing `undatedLabel` copy (reused, not duplicated).
- New pure helper `src/lib/letters/group-deadlines-by-day.ts`: groups `FlatDeadline[]` by ISO date (`YYYY-MM-DD`) into a plain `Record<string, FlatDeadline[]>`. Pure, testable like its sibling `group-deadlines-by-month.ts`.
- New pure helper `src/lib/letters/build-calendar-weeks.ts`: given a month (`Date`, day 1) returns `{ iso: string; inCurrentMonth: boolean }[][]` — a 6x7 grid including the previous/next month's padding days, so a deadline landing on a padding day is never hidden, just visually dimmed. Weeks always start Monday — matches the app's German/European context, not locale-conditional.
- Extract the existing inline `language -> Intl locale` mapping out of `group-deadlines-by-month.ts` into a tiny shared `src/lib/letters/locale.ts` (`appLanguageToLocale(language): string`), so the calendar's month/weekday labels and the existing month-group labels share one source instead of two copies.
- New client component `deadlines/deadlines-calendar.tsx`:
  - Props: `deadlinesByDay: Record<string, FlatDeadline[]>`, `language`, a small `copy` slice.
  - State: `viewedMonth` (Date, defaults to the month of the soonest upcoming ISO deadline if any exist, else today), `selectedDay` (iso string | null, reset whenever `viewedMonth` changes).
  - Header: month/year label (`Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })`) + prev/next month buttons (`ChevronLeft`/`ChevronRight`, new `aria-label` copy) + a "Today" button that resets `viewedMonth`.
  - Grid: `dir="ltr"` always, even in Arabic — a calendar's day-of-week progression is a structural convention, not translatable content (mirrors the existing pattern of pinning German source-quote spans to `dir="ltr"` inside RTL pages, e.g. letter-detail's `source_quote`). Weekday header abbreviations via `Intl.DateTimeFormat(locale, { weekday: "short" })` over a fixed Mon-Sun reference week — no new copy keys needed for those.
  - Day cell: day number + (if it has deadlines) a small accent-pill badge with the count, same chunky/hard-border chip language as the rest of the app. Today gets a ring. Selected day gets `bg-primary`. Cells with 0 deadlines render as a non-interactive `<span>`; cells with 1+ render as a `<button>` that's a `Popover` trigger (reusing the existing `Popover`/`PopoverTrigger`/`PopoverContent` primitives already used by `LetterFilters`).
  - Popover content: lists that day's deadlines, each a `Link` to `/letters/[id]#deadlines`, same description/summary layout as today's flat-list card — just without the date pill, since the date is now implied by the day you clicked.
- Undated section: the current page's list styling, unchanged, just filtered to non-ISO entries and moved below the calendar under the existing `undatedLabel` heading.
- Empty state (zero deadlines of any kind, dated or not): unchanged `EmptyState`.
- `loading.tsx`: replace the 3-row flat-list skeleton with a calendar-shaped skeleton (header bar + 7x6 grid of small skeleton cells), since the loading state must match the real layout.
- New copy (`deadlines` namespace, EN/AR/TR): `prevMonth`, `nextMonth`, `todayLabel`, `deadlineCountOnDay: (n: number) => string` (used as the day button's `aria-label`).

## data across the server/client boundary

`page.tsx` stays a Server Component doing the Supabase fetch + `flattenAndSortDeadlines`, then calls `groupDeadlinesByDay` and passes the resulting plain `Record` (not a `Map` — not directly serializable as a Server→Client prop) into `DeadlinesCalendar`.

## edge cases

- Multiple deadlines on the same day: badge shows the count; popover lists all of them.
- A deadline with a non-ISO date (free text) never appears on the grid, only in the undated list — matches today's behavior, which already can't place it on a specific date either.
- Navigating to a different month closes any open popover and clears `selectedDay` (tied to the `viewedMonth` state reset).
- RTL (Arabic): page heading/nav/undated-list follow `dir="rtl"` as today; the calendar grid itself stays `dir="ltr"` (see rationale above) — verified visually in the UI gate.
