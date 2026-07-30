export type AppLanguage = "en" | "ar" | "tr";

export type LetterAnalysis = {
  summary: string;
  deadlines: { date: string; description: string }[];
  reply_draft: string;
  detected_language_confirmed: boolean;
  risk_flags: string[];
};

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};
