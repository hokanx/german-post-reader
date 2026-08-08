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

const lettersWithNonIsoDate = [
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
      { date: "innerhalb von 14 Tagen", description: "Respond to notice" },
      { date: "2026-06-01", description: "Submit form" },
    ],
  },
];

const nonIsoResult = flattenAndSortDeadlines(lettersWithNonIsoDate);

assert(
  nonIsoResult.slice(0, 3).every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)),
  "non-ISO date string doesn't get sorted into the middle of the ISO-dated deadlines",
);
assert(
  nonIsoResult.some((d) => d.date === "innerhalb von 14 Tagen" && d.description === "Respond to notice"),
  "non-ISO deadline still appears in the output, nothing silently dropped",
);
