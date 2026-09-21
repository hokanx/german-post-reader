import type { AppLanguage } from "@/lib/letters/types";
import { appLanguageToLocale } from "@/lib/letters/locale";

/**
 * A value is only formatted if it BEGINS with an unambiguous ISO date.
 *
 * `new Date()` will happily parse a German `10.03.2026` as October 3rd — so
 * the previous `new Date(x); if (isNaN) return x;` guard did not catch it, it
 * produced a confidently wrong localized date seven months late. Worse, it
 * only misfired when the day was <= 12; `15.03.2026` failed to parse and fell
 * through raw, so the bug looked absent most of the time.
 *
 * Gemini's deadline schema explicitly allows a non-ISO fallback ("the date as
 * written in the letter"), so German dd.mm.yyyy values reach here routinely.
 * Anything not starting with YYYY-MM-DD is returned untouched — a raw German
 * date is honest, a wrong localized one is not.
 */
const LEADING_ISO_DATE_RE = /^(\d{4}-\d{2}-\d{2})/;

/** Matches what follows the date in a datetime value: "2026-03-10, 10:00", "...T10:00", "... 10:00 Uhr". */
const ISO_DATE_WITH_REMAINDER_RE = /^(\d{4}-\d{2}-\d{2})[,T\s]+(.*\S)\s*$/;

function formatIsoDatePart(isoDate: string, language: AppLanguage): string {
  // Parsed as LOCAL midnight rather than `new Date("2026-03-10")`, which is
  // UTC midnight and renders as the previous day anywhere west of UTC —
  // including a React hydration mismatch, since the server runs in UTC and
  // the browser does not.
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(appLanguageToLocale(language), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date for display. Accepts a bare ISO date or any value beginning
 * with one (e.g. a `created_at` timestamp); returns anything else unchanged,
 * including free-text German deadlines like "innerhalb von 14 Tagen".
 *
 * Only the date is rendered. For a value that may carry a time — appointments
 * — use formatDateTime, which preserves it.
 */
export function formatDate(value: string, language: AppLanguage): string {
  const match = LEADING_ISO_DATE_RE.exec(value);
  if (!match) return value;
  return formatIsoDatePart(match[1], language);
}

/**
 * Like formatDate, but keeps any time the value carries.
 *
 * Appointments are defined as a fixed date AND time the recipient must
 * physically attend, and the Gemini schema tells the model to append the time
 * when the letter states one ("2026-03-10, 10:00"). Routing those through the
 * date-only formatter silently dropped the time — on the one field where the
 * time is the entire point.
 *
 * The time portion is re-appended verbatim rather than reformatted: it may be
 * "10:00", "10:00 Uhr", or a range, and rewriting it risks losing meaning the
 * letter actually stated.
 */
export function formatDateTime(value: string, language: AppLanguage): string {
  const withRemainder = ISO_DATE_WITH_REMAINDER_RE.exec(value);
  if (withRemainder) {
    return `${formatIsoDatePart(withRemainder[1], language)}, ${withRemainder[2]}`;
  }
  return formatDate(value, language);
}
