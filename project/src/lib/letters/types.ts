export type AppLanguage = "en" | "ar" | "tr";

export type LetterAnalysis = {
  summary: string;
  deadlines: { date: string; description: string }[];
  /** Always German — this is the text that actually gets sent to the German recipient. */
  reply_draft: string;
  /** The reply_draft's meaning, translated into the user's chosen language, so they know what they're sending. */
  reply_draft_translation: string;
  detected_language_confirmed: boolean;
  risk_flags: string[];
};

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};
