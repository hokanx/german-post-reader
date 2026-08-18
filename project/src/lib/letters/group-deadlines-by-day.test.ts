import { groupDeadlinesByDay } from "./group-deadlines-by-day";
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
  { date: "2026-03-15", description: "Pay balance", letterId: "a", letterSummary: "Electricity bill", language: "en" },
  { date: "2026-03-15", description: "Submit form", letterId: "b", letterSummary: "Insurance renewal", language: "en" },
  { date: "2026-04-01", description: "Confirm renewal", letterId: "c", letterSummary: "Renewal notice", language: "en" },
  { date: "innerhalb von 14 Tagen", description: "Respond to notice", letterId: "d", letterSummary: "Some notice", language: "en" },
];

const byDay = groupDeadlinesByDay(deadlines);

assert(Object.keys(byDay).length === 2, "produces one bucket per distinct ISO date (non-ISO excluded)");
assert(byDay["2026-03-15"]?.length === 2, "multiple deadlines on the same day land in one bucket, in order");
assert(byDay["2026-03-15"][0].letterId === "a" && byDay["2026-03-15"][1].letterId === "b", "same-day order preserved");
assert(byDay["2026-04-01"]?.length === 1, "single-deadline day gets a one-item bucket");
assert(byDay["innerhalb von 14 Tagen"] === undefined, "non-ISO date never becomes a bucket key");

const empty = groupDeadlinesByDay([]);
assert(Object.keys(empty).length === 0, "empty input produces an empty record");
