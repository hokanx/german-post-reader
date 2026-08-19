export type AppLanguage = "en" | "ar" | "tr";

/** Broad category of who sent the letter — drives the dashboard card's icon. Not translated text; the DB stores this fixed slug and each locale supplies its own label (see SENDER_CATEGORY_ICONS / copy.ts). */
export type SenderCategory = "authority" | "insurer" | "bank" | "landlord" | "utility" | "school" | "delivery" | "other";

export const SENDER_CATEGORIES: SenderCategory[] = [
  "authority",
  "insurer",
  "bank",
  "landlord",
  "utility",
  "school",
  "delivery",
  "other",
];

export type LetterAnalysis = {
  summary: string;
  /** The sender's name as printed on the letter (e.g. "Finanzamt München"), in the original German/Latin form — never translated, same treatment as an org name or a source_quote. */
  sender_name: string;
  /** Broad category of who sent the letter (Behörde, insurer, bank, landlord, utility, school, delivery, or other) — powers the dashboard card's icon. */
  sender_category: SenderCategory;
  /** ISO 8601 date the letter itself is dated/issued (e.g. "München, den 15.03.2026"), distinct from when the user uploaded it. Empty string if no date is printed or determinable. */
  letter_date: string;
  deadlines: { date: string; description: string }[];
  /** Every payment amount or payment change in the letter (amount owed, a new/changed fee, an installment) — never omitted when the letter states one. Empty array only if the letter truly has no payment component. */
  payments: { description: string; amount: string; source_quote: string }[];
  /** Every fixed date/time the recipient must physically be present for (an inspection, a hearing, a checkup) — distinct from deadlines, which are dates to act by with no attendance required. */
  appointments: { description: string; date: string; source_quote: string }[];
  /** Concrete facts (amounts, dates, reference numbers) each backed by their original German wording. */
  key_facts: { label: string; value: string; source_quote: string }[];
  /** True if the recipient must do something (pay, respond, submit, appear) — false for purely informational letters. */
  action_required: boolean;
  /** Always German — this is the text that actually gets sent to the German recipient. */
  reply_draft: string;
  /** The reply_draft's meaning, translated into the user's chosen language, so they know what they're sending. */
  reply_draft_translation: string;
  detected_language_confirmed: boolean;
  risk_flags: string[];
};

/**
 * Native self-names, not translations of the English word — "the reply is
 * translated into العربية" reads correctly in an Arabic sentence, "the reply
 * is translated into Arabic" (the English word, mid-Arabic-sentence) wouldn't.
 */
export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

export type ReplyTone = "confirm" | "request_time" | "object" | "clarify";

export const REPLY_TONE_LABELS: Record<AppLanguage, Record<ReplyTone, string>> = {
  en: {
    confirm: "Confirm / accept",
    request_time: "Ask for more time",
    object: "Object / dispute",
    clarify: "Ask a question first",
  },
  ar: {
    confirm: "تأكيد / موافقة",
    request_time: "طلب مزيد من الوقت",
    object: "اعتراض / نزاع",
    clarify: "طرح سؤال أولاً",
  },
  tr: {
    confirm: "Onayla / kabul et",
    request_time: "Daha fazla süre iste",
    object: "İtiraz et / anlaşmazlık bildir",
    clarify: "Önce bir soru sor",
  },
};

export const REPLY_TONE_INSTRUCTIONS: Record<ReplyTone, string> = {
  confirm:
    "Write a reply that confirms receipt and agrees to comply, pay, or accept what the letter asks, in a cooperative and formal tone.",
  request_time:
    "Write a reply that politely requests a short extension or more time before acting on the letter, giving a brief, reasonable justification.",
  object:
    "Write a reply that politely but firmly objects to or disputes the letter's claim, amount, or decision, using the specific reason given in \"The user's answer to work into the reply\" above as the basis for the objection, and asks for reconsideration or a clearer explanation.",
  clarify:
    "Write a reply that does not commit to anything yet, but asks the recipient exactly the question given in \"The user's answer to work into the reply\" above, phrased formally for an official German letter — do not invent a different clarifying question of your own.",
};
