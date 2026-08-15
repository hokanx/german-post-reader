import { groupDeadlinesByMonth } from "./group-deadlines-by-month";
import type { FlatDeadline } from "./flatten-deadlines";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const deadlines: FlatDeadline[] = [
  { date: "2026-01-10", description: "Confirm renewal", letterId: "b", letterSummary: "Insurance renewal" },
  { date: "2026-01-25", description: "Second January item", letterId: "e", letterSummary: "Another letter" },
  { date: "2026-03-15", description: "Pay balance", letterId: "a", letterSummary: "Electricity bill" },
  { date: "innerhalb von 14 Tagen", description: "Respond to notice", letterId: "c", letterSummary: "Some notice" },
];

const groups = groupDeadlinesByMonth(deadlines, "en-GB", "No fixed date");

assert(groups.length === 3, "produces 3 groups: Jan, Mar, and undated");
assert(groups[0].key === "2026-01" && groups[0].deadlines.length === 2, "January group has both January deadlines, in order");
assert(groups[1].key === "2026-03" && groups[1].deadlines.length === 1, "March group has the one March deadline");
assert(groups[1].label === "March 2026", "month label is formatted via Intl.DateTimeFormat");
assert(groups[2].key === "undated" && groups[2].label === "No fixed date", "non-ISO deadlines land in a final undated group with the given label");

const decJanGroups = groupDeadlinesByMonth(
  [
    { date: "2025-12-20", description: "December item", letterId: "x", letterSummary: "" },
    { date: "2026-01-05", description: "January item", letterId: "y", letterSummary: "" },
  ],
  "en-GB",
  "No fixed date",
);
assert(decJanGroups.length === 2 && decJanGroups[0].key === "2025-12" && decJanGroups[1].key === "2026-01", "December/January year boundary doesn't merge into one group");
