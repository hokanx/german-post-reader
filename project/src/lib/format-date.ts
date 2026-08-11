import type { AppLanguage } from "@/lib/letters/types";

const DATE_LOCALES: Record<AppLanguage, string> = { en: "en-GB", ar: "ar-EG", tr: "tr-TR" };

/** Formats an ISO date for display; returns the raw string unchanged if it isn't a parseable date (e.g. free-text German deadlines like "innerhalb von 14 Tagen"). */
export function formatDate(iso: string, language: AppLanguage): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(DATE_LOCALES[language], { day: "2-digit", month: "short", year: "numeric" });
}
