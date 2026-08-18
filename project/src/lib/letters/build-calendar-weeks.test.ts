import { buildCalendarWeeks } from "./build-calendar-weeks";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// March 2026 starts on a Sunday.
const march = buildCalendarWeeks(new Date(2026, 2, 1));

assert(march.length === 6, "always produces 6 weeks regardless of month length");
assert(march.every((week) => week.length === 7), "every week has exactly 7 days");
assert(march[0][0].iso === "2026-02-23", "grid starts on the Monday before the 1st (month starts Sunday)");
assert(march[0][6].iso === "2026-03-01" && march[0][6].inCurrentMonth, "first Sunday cell is March 1st, flagged in-month");
assert(!march[0][0].inCurrentMonth, "leading padding day is flagged out-of-month");
assert(march[5][1].iso === "2026-03-31" && march[5][1].inCurrentMonth, "March 31st lands correctly (Tuesday of week 6)");
assert(march[5][2].iso === "2026-04-01" && !march[5][2].inCurrentMonth, "trailing padding rolls into April, flagged out-of-month");

// February 2026 starts on a Sunday and is 28 days (no padding-day ambiguity
// from a Monday-start month, different case from March above).
const february = buildCalendarWeeks(new Date(2026, 1, 1));
const allIsos = february.flat().map((d) => d.iso);
assert(new Set(allIsos).size === 42, "all 42 cells have distinct dates");
assert(allIsos.includes("2026-02-01") && allIsos.includes("2026-02-28"), "full month range is present");

// A month that starts on a Monday needs zero leading padding days.
const juneStartsMonday = buildCalendarWeeks(new Date(2026, 5, 1));
assert(juneStartsMonday[0][0].iso === "2026-06-01" && juneStartsMonday[0][0].inCurrentMonth, "month starting on Monday has no leading padding");
