export type CalendarDay = { iso: string; inCurrentMonth: boolean };

/**
 * Formats using local getters (never `toISOString`, which converts to UTC
 * first — for any positive UTC offset, e.g. Germany, that silently shifts
 * local midnight back to the previous day's date).
 */
function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Monday = 0 .. Sunday = 6, vs. JS's native Sunday = 0 .. Saturday = 6. */
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

/**
 * Builds a fixed 6-week (42-day) Monday-start grid for the month containing
 * `monthStart`, padded with the previous/next month's days so a deadline
 * landing on a padding day is never hidden (`inCurrentMonth: false` just
 * flags it for dimmed styling). Always 6 rows regardless of month length,
 * so the grid's height never jumps when navigating between months.
 */
export function buildCalendarWeeks(monthStart: Date): CalendarDay[][] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - mondayIndex(firstOfMonth.getDay()));

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    days.push({ iso: toIso(day), inCurrentMonth: day.getMonth() === month });
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < 42; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
