import { formatDate, formatDateTime } from "./format-date";

let failures = 0;

function check(label: string, actual: string, expected: string) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}: ${label}${ok ? "" : ` — got "${actual}", expected "${expected}"`}`);
}

// --- The regression this file exists for ---------------------------------
// `new Date("10.03.2026")` parses as October 3rd, so the old guard
// (`new Date(x); if (isNaN) return x`) produced a confidently wrong date
// seven months late. It only misfired for days <= 12, which is why it looked
// fine most of the time. Gemini's deadline schema explicitly permits this
// non-ISO fallback ("the date as written in the letter"), so these arrive
// routinely.
check("German dd.mm.yyyy is never reinterpreted (day <= 12)", formatDate("10.03.2026", "en"), "10.03.2026");
check("German dd.mm.yyyy is never reinterpreted (day > 12)", formatDate("15.03.2026", "en"), "15.03.2026");
check("German dd.mm.yyyy, single-digit", formatDate("01.02.2026", "en"), "01.02.2026");

// Free text must survive untouched.
check("free-text deadline passes through", formatDate("innerhalb von 14 Tagen", "en"), "innerhalb von 14 Tagen");
check("empty string passes through", formatDate("", "en"), "");

// --- Real ISO dates still format ------------------------------------------
check("bare ISO formats", formatDate("2026-03-10", "en"), "10 Mar 2026");
// Asserted structurally rather than against an exact month abbreviation,
// which varies with the Node build's ICU data ("Sep" vs "Sept").
const createdAt = formatDate("2026-09-20T11:24:00.000Z", "en");
check(
  "ISO timestamp (created_at) renders as a date, not a raw timestamp",
  String(createdAt.includes("2026") && createdAt.includes("20") && !/[TZ]|\d{2}:\d{2}/.test(createdAt)),
  "true",
);

// Local-midnight parsing: "2026-03-10" must not render as the 9th in any
// timezone west of UTC (it also caused a server/client hydration mismatch).
check("ISO date does not shift by timezone", formatDate("2026-03-10", "en"), "10 Mar 2026");

// --- The appointment-time regression --------------------------------------
// The schema tells Gemini to append the time when the letter states one.
// Routing that through the date-only formatter dropped it — on the one field
// whose entire purpose is "be physically present at this time".
check("appointment keeps its time", formatDateTime("2026-03-10, 10:00", "en"), "10 Mar 2026, 10:00");
check("appointment keeps a German time", formatDateTime("2026-03-10 10:00 Uhr", "en"), "10 Mar 2026, 10:00 Uhr");
check("appointment with T separator", formatDateTime("2026-03-10T09:30", "en"), "10 Mar 2026, 09:30");
check("date-only appointment still works", formatDateTime("2026-03-10", "en"), "10 Mar 2026");
check("non-ISO appointment passes through", formatDateTime("nächsten Dienstag", "en"), "nächsten Dienstag");

// --- Locale routing --------------------------------------------------------
// format-date previously kept its own copy of the language->locale map; it
// now delegates to appLanguageToLocale(), so a new language is one edit.
// Proves the locale actually routes through appLanguageToLocale() without
// pinning an exact ICU spelling: German and English must differ, and Arabic
// must use Arabic-Indic digits (ar-EG).
const de = formatDate("2026-03-10", "de");
const en = formatDate("2026-03-10", "en");
check("German and English render differently", String(de !== en), "true");
check("German contains a German month", String(/März|Mär/.test(de)), "true");
check("Arabic uses ar-EG digits", String(/[٠-٩]/.test(formatDate("2026-03-10", "ar"))), "true");

if (failures > 0) {
  console.log(`\n${failures} failure(s)`);
  process.exitCode = 1;
}
