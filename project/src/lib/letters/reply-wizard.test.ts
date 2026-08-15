import { computeRequestTimeOptions, buildMailtoUrl } from "./reply-wizard";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// computeRequestTimeOptions
assert(computeRequestTimeOptions(null).length === 0, "null base deadline yields no options");
assert(computeRequestTimeOptions("innerhalb von 14 Tagen").length === 0, "non-ISO base deadline yields no options");

const options = computeRequestTimeOptions("2026-02-28");
assert(options.length === 3, "valid ISO base deadline yields 3 options");
assert(options[0].id === "plus_one_month" && options[0].date === "2026-03-28", "plus_one_month adds one calendar month");
assert(options[1].id === "plus_two_months" && options[1].date === "2026-04-28", "plus_two_months adds two calendar months");
assert(options[2].id === "instalments" && options[2].date === null, "instalments has no specific date");

const decemberOptions = computeRequestTimeOptions("2026-12-15");
assert(decemberOptions[0].date === "2027-01-15", "plus_one_month rolls over into the next year correctly");
assert(decemberOptions[1].date === "2027-02-15", "plus_two_months rolls over into the next year correctly");

// buildMailtoUrl
const url = buildMailtoUrl("Line one\nLine two & more", "My reply");
assert(url.startsWith("mailto:?"), "mailto URL has no recipient, just query params");
assert(url.includes("subject=My%20reply"), "subject is URL-encoded");
assert(url.includes("body=Line%20one%0ALine%20two%20%26%20more"), "body newlines and special characters are URL-encoded");
