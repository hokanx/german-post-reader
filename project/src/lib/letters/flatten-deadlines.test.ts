import { flattenAndSortDeadlines } from "./flatten-deadlines";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const letters = [
  {
    id: "letter-a",
    summary: "Electricity bill",
    deadlines: [{ date: "2026-03-15", description: "Pay balance" }],
  },
  {
    id: "letter-b",
    summary: "Insurance renewal",
    deadlines: [
      { date: "2026-01-10", description: "Confirm renewal" },
      { date: "2026-06-01", description: "Submit form" },
    ],
  },
  {
    id: "letter-c",
    summary: "No deadlines here",
    deadlines: [],
  },
  {
    id: "letter-d",
    summary: null,
    deadlines: null,
  },
];

const result = flattenAndSortDeadlines(letters);

assert(result.length === 3, "flattens 3 total deadlines across letters (empty/null letters contribute none)");
assert(result[0].date === "2026-01-10", "sorted soonest first");
assert(result[0].letterId === "letter-b", "carries the source letter id");
assert(result[1].date === "2026-03-15", "second-soonest is next");
assert(result[2].date === "2026-06-01", "latest is last");
assert(result[0].letterSummary === "Insurance renewal", "carries the source letter's summary");
