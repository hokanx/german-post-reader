import type { AppLanguage } from "./types";

/** Maps the app's three languages to an `Intl` locale for date/month formatting — shared by every call site that formats a date (avoids the ternary living in more than one file). */
export function appLanguageToLocale(language: AppLanguage): string {
  if (language === "ar") return "ar-EG";
  if (language === "tr") return "tr-TR";
  if (language === "de") return "de-DE";
  if (language === "uk") return "uk-UA";
  return "en-GB";
}
