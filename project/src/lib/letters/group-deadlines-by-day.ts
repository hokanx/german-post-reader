import type { FlatDeadline } from "./flatten-deadlines";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Buckets deadlines by exact ISO date for the calendar grid — only
 * ISO-dated entries can land on a specific day cell; free-text dates (e.g.
 * "innerhalb von 14 Tagen") are excluded here and shown separately as an
 * undated list, same as they already are in the month-grouped view.
 * Returns a plain Record (not a Map) since this crosses the Server ->
 * Client Component boundary as a prop.
 */
export function groupDeadlinesByDay(deadlines: FlatDeadline[]): Record<string, FlatDeadline[]> {
  const byDay: Record<string, FlatDeadline[]> = {};
  for (const deadline of deadlines) {
    if (!ISO_DATE_RE.test(deadline.date)) continue;
    (byDay[deadline.date] ??= []).push(deadline);
  }
  return byDay;
}
