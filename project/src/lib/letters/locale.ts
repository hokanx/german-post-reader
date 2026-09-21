import type { AppLanguage } from "./types";

/** Maps the app's languages to an `Intl` locale for date/month formatting — shared by every call site that formats a date (avoids the ternary living in more than one file). */
export function appLanguageToLocale(language: AppLanguage): string {
  if (language === "ar") return "ar-EG";
  if (language === "tr") return "tr-TR";
  if (language === "de") return "de-DE";
  if (language === "uk") return "uk-UA";
  return "en-GB";
}

/** The languages that render right-to-left. Of the five supported, only Arabic. */
const RTL_LANGUAGES = new Set<AppLanguage>(["ar"]);

/**
 * The single place that decides text direction.
 *
 * `language === "ar" ? "rtl" : "ltr"` is currently hand-written at ~37 call
 * sites across ~28 files, and RTL/locale bugs account for 13 of this repo's
 * shipped fixes — components that forgot the ternary, or applied the account
 * language where the content language belonged. Every one of those sites is an
 * independent chance to forget, and adding a sixth language would mean editing
 * all of them.
 *
 * Use this instead of writing the ternary. Two directions coexist on the letter
 * pages and must not be conflated:
 *   - page chrome follows the ACCOUNT language
 *   - a letter's content follows THAT LETTER'S stored language
 *   - German source quotes are always lang="de" dir="ltr", regardless of both
 *
 * Anything carrying `dir` should also carry `lang`: screen readers pick voice
 * from `lang`, not `dir` (WCAG 3.1.2).
 */
export function textDirection(language: AppLanguage): "rtl" | "ltr" {
  return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
}

/** Convenience for the `isRtl`-shaped call sites (conditional icons, mirrored offsets). */
export function isRtl(language: AppLanguage): boolean {
  return RTL_LANGUAGES.has(language);
}
