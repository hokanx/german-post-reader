import { buildShareSummary, type ShareSummaryCopy } from "./build-share-summary";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const copy: ShareSummaryCopy = {
  paymentsHeading: "Payments",
  appointmentsHeading: "Appointments",
  deadlines: "Deadlines",
  keyFactsHeading: "Key facts",
  summaryWatermark: "— Summarized by Papkram · papkram.de",
};

const fullLetter = {
  openingLine: "This letter is from Stadtwerke München, dated 15 Mar 2026.",
  summary: "You owe an extra 187,42 € on your 2025 electricity bill.",
  payments: [{ description: "Amount owed", amount: "187,42 €" }],
  appointments: [{ description: "Heating inspection", date: "2026-04-10" }],
  deadlines: [{ description: "Pay by", date: "2026-02-28" }],
  keyFacts: [{ label: "Reference number", value: "AZ-4471-B" }],
};

const full = buildShareSummary(fullLetter, copy);

assert(full.includes(fullLetter.openingLine), "includes the opening sender/date sentence");
assert(full.indexOf(fullLetter.openingLine) < full.indexOf(fullLetter.summary), "opening sentence comes before the summary, explaining the letter rather than just dumping the summary first");
assert(full.includes(fullLetter.summary), "includes the summary");
assert(full.includes("Payments") && full.includes("- Amount owed: 187,42 €"), "includes a formatted payments section");
assert(full.includes("Appointments") && full.includes("- Heating inspection — 2026-04-10"), "includes a formatted appointments section");
assert(full.includes("Deadlines") && full.includes("- Pay by — 2026-02-28"), "includes a formatted deadlines section");
assert(full.includes("Key facts") && full.includes("- Reference number: AZ-4471-B"), "includes a formatted key facts section");
assert(full.trim().endsWith(copy.summaryWatermark), "watermark line is always last");

const minimalLetter = {
  openingLine: "",
  summary: "A purely informational letter with nothing else to report.",
  payments: [],
  appointments: [],
  deadlines: [],
  keyFacts: [],
};

const minimal = buildShareSummary(minimalLetter, copy);

assert(!minimal.includes("Payments"), "empty payments section is omitted entirely, not rendered as an empty heading");
assert(!minimal.includes("Appointments"), "empty appointments section is omitted");
assert(!minimal.includes("Deadlines"), "empty deadlines section is omitted");
assert(!minimal.includes("Key facts"), "empty key facts section is omitted");
assert(minimal.includes(minimalLetter.summary), "summary is still present with no sections");
assert(minimal.trim().endsWith(copy.summaryWatermark), "watermark is present even on a minimal letter");
assert(minimal.trimStart().startsWith(minimalLetter.summary), "an empty opening line (e.g. no sender name available) is skipped entirely, not left as a blank leading line");
