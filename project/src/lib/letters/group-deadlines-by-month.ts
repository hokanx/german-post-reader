import type { FlatDeadline } from "./flatten-deadlines";

export type MonthGroup = { key: string; label: string; deadlines: FlatDeadline[] };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Input is expected to already be sorted (soonest ISO date first, non-ISO
 * appended after — see flattenAndSortDeadlines), so this only buckets by
 * month key in the order it receives them, never re-sorting.
 */
export function groupDeadlinesByMonth(deadlines: FlatDeadline[], locale: string, undatedLabel: string): MonthGroup[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const groups: MonthGroup[] = [];

  for (const deadline of deadlines) {
    const isIso = ISO_DATE_RE.test(deadline.date);
    const key = isIso ? deadline.date.slice(0, 7) : "undated";
    let group = groups.find((g) => g.key === key);
    if (!group) {
      const label = isIso ? formatter.format(new Date(`${key}-01T00:00:00Z`)) : undatedLabel;
      group = { key, label, deadlines: [] };
      groups.push(group);
    }
    group.deadlines.push(deadline);
  }

  return groups;
}
