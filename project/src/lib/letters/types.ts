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

export type ReplyTone = "confirm" | "request_time" | "object" | "clarify";

export const REPLY_TONE_LABELS: Record<ReplyTone, string> = {
  confirm: "Confirm / accept",
  request_time: "Ask for more time",
  object: "Object / dispute",
  clarify: "Ask a question first",
};

export const REPLY_TONE_INSTRUCTIONS: Record<ReplyTone, string> = {
  confirm:
    "Write a reply that confirms receipt and agrees to comply, pay, or accept what the letter asks, in a cooperative and formal tone.",
  request_time:
    "Write a reply that politely requests a short extension or more time before acting on the letter, giving a brief, reasonable justification.",
  object:
    "Write a reply that politely but firmly objects to or disputes the letter's claim, amount, or decision, and asks for reconsideration or a clearer explanation of its basis.",
  clarify:
    "Write a reply that does not commit to anything yet, but asks a clarifying question about the point in the letter that is ambiguous or unclear before responding substantively.",
};
