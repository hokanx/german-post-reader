import * as Sentry from "@sentry/nextjs";
import { Type } from "@google/genai";
import { createGeminiClient, GEMINI_MODEL } from "./client";
import {
  LANGUAGE_NAMES,
  REPLY_TONE_INSTRUCTIONS,
  SENDER_CATEGORIES,
  type AppLanguage,
  type LetterAnalysis,
  type ReplyTone,
} from "@/lib/letters/types";
import type { Result } from "@/lib/result";

/** The user's own name/address, stored once in Settings, so the AI can use it as the reply's real letterhead instead of a bracketed placeholder. Either field may be unset. */
export type SenderInfo = { fullName: string | null; postalAddress: string | null };

function senderContextLine(sender?: SenderInfo): string | null {
  if (!sender) return null;
  const parts = [sender.fullName, sender.postalAddress].filter((v): v is string => !!v && v.trim().length > 0);
  if (parts.length === 0) return null;
  return `Sender's real name and address to use as the reply's letterhead: ${parts.join(", ")}`;
}

const SENDER_INSTRUCTION =
  'If a "Sender\'s real name and address" line is present above, use it verbatim as the reply\'s letterhead (Absender). If it is absent, use a generic bracketed placeholder like "[Ihr Name]" / "[Ihre Adresse]" — never invent a fake name or address.';

type ReplyDraft = {
  reply_draft: string;
  reply_draft_translation: string;
  answer_understood: boolean;
  answer_clarification: string;
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description:
        "Plain-language summary of the letter, written for someone who doesn't read German. Do NOT name the sender — that's captured separately in sender_name and shown on its own. Go straight into what the letter is about and why it matters.",
    },
    sender_name: {
      type: Type.STRING,
      description:
        "The sender's name exactly as printed on the letter (e.g. 'Finanzamt München', 'Vodafone Kabel Deutschland'). Never translated — organization names stay in their original form regardless of target language.",
    },
    sender_category: {
      type: Type.STRING,
      enum: SENDER_CATEGORIES,
      description:
        "Broad category of who sent the letter: 'authority' (Behörde — tax office, immigration office, Jobcenter, Bürgeramt, court, pension insurance, broadcasting fee, etc.), 'insurer', 'bank', 'landlord', 'utility' (electricity/gas/water/internet/heating), 'school', 'delivery' (parcel/post), or 'other'.",
    },
    letter_date: {
      type: Type.STRING,
      description:
        "The date the letter itself is dated/issued, exactly as printed near the sender's address or signature (e.g. 'München, den 15.03.2026'), converted to ISO 8601 (YYYY-MM-DD). This is when the SENDER wrote/issued the letter, not any deadline or appointment date. Empty string if no such date is printed or it can't be confidently read.",
    },
    deadlines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "ISO 8601 date (YYYY-MM-DD) if known, otherwise the date as written in the letter." },
          description: { type: Type.STRING, description: "What is due or must happen by this date." },
        },
        required: ["date", "description"],
        propertyOrdering: ["date", "description"],
      },
    },
    payments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: "Plain-language description of what this payment is, e.g. 'Amount you owe' or 'New monthly fee'." },
          amount: { type: Type.STRING, description: "The amount exactly as it should be shown to the reader, e.g. '187,42 €'. Never rounded, reformatted, or converted." },
          source_quote: { type: Type.STRING, description: "The exact original German text this amount was read from, verbatim from the letter." },
        },
        required: ["description", "amount", "source_quote"],
        propertyOrdering: ["description", "amount", "source_quote"],
      },
      description: "EVERY payment amount or payment change stated in the letter — an amount owed, a new or changed fee, an installment, a partial payment. This is frequently the single most consequential number in the letter; scan the whole letter specifically for it and never omit one that's present. Empty array only if the letter genuinely has no payment component.",
    },
    appointments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: "Plain-language description of what the recipient must attend, e.g. 'Heating inspection' or 'Court appearance as a witness'." },
          date: { type: Type.STRING, description: "ISO 8601 date (YYYY-MM-DD), plus the time if the letter states one (e.g. '2026-03-10, 10:00'), otherwise the date as written." },
          source_quote: { type: Type.STRING, description: "The exact original German text this appointment was read from, verbatim from the letter." },
        },
        required: ["description", "date", "source_quote"],
        propertyOrdering: ["description", "date", "source_quote"],
      },
      description: "Every fixed date/time the recipient must physically be present for or attend — an inspection, a hearing, a medical appointment, a scheduled visit. Distinct from deadlines: a deadline is a date to act by (pay, submit, respond) with no attendance required; an appointment is somewhere the recipient must actually show up. If a letter only asks the recipient to pick or confirm a time (no fixed slot yet), that's a deadline, not an appointment. Empty array if the letter has no fixed appointment.",
    },
    key_facts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Short plain-language name for the fact, e.g. 'Reference number' or 'Policy number'." },
          value: { type: Type.STRING, description: "The fact's value as the reader should see it." },
          source_quote: { type: Type.STRING, description: "The exact original German text this fact was read from, verbatim from the letter." },
        },
        required: ["label", "value", "source_quote"],
        propertyOrdering: ["label", "value", "source_quote"],
      },
      description: "Concrete facts worth backing with the original text — reference numbers, names, non-payment figures. Empty array if the letter has no such facts. Do not duplicate the deadlines, payments, or appointments lists here.",
    },
    action_required: {
      type: Type.BOOLEAN,
      description: "True if the recipient must do something (pay, respond, submit a document, appear somewhere), by a deadline or in general. False for purely informational letters.",
    },
    reply_draft: {
      type: Type.STRING,
      description: "A ready-to-send reply letter, written in GERMAN (the recipient — Behörde, bank, insurer, landlord, etc. — reads German), appropriate to the sender and formal enough for official correspondence.",
    },
    reply_draft_translation: {
      type: Type.STRING,
      description: "The reply_draft's meaning translated into the target language, so the reader understands what they're about to send. Not a second reply — a faithful translation of the exact same letter.",
    },
    detected_language_confirmed: {
      type: Type.BOOLEAN,
      description: "True if the source text was confidently German; false if the OCR/vision read was too garbled to be sure.",
    },
    risk_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Plain-language warnings about any amount, date, or instruction the model is not fully confident it read correctly. Empty array if none.",
    },
  },
  required: [
    "summary",
    "sender_name",
    "sender_category",
    "letter_date",
    "deadlines",
    "payments",
    "appointments",
    "key_facts",
    "action_required",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
  propertyOrdering: [
    "summary",
    "sender_name",
    "sender_category",
    "letter_date",
    "deadlines",
    "payments",
    "appointments",
    "key_facts",
    "action_required",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
};

function buildSystemInstruction(language: AppLanguage, sender?: SenderInfo) {
  const senderLine = senderContextLine(sender);
  return `You read official German postal letters (Behörde notices, bank mail, insurance, landlord letters) for someone who cannot read German confidently. Extract the letter's content, then respond ONLY with the JSON object matching the required schema.
${senderLine ? `\n${senderLine}\n` : ""}
Rules:
- summary: plain language, no legal jargon. Do NOT name the sender — that's already captured separately in sender_name and shown on its own. Start straight in on what the letter is about and why it matters. Written entirely in ${LANGUAGE_NAMES[language]}.
- sender_name: the sender's name exactly as printed on the letter, in its original form — never translated.
- sender_category: classify who sent it as one of authority, insurer, bank, landlord, utility, school, delivery, or other.
- letter_date: the date the letter itself is dated/issued, exactly as printed near the sender's address or signature (e.g. "München, den 15.03.2026") — this is when the sender wrote the letter, not a deadline or appointment date. Convert to ISO 8601 (YYYY-MM-DD). Empty string if no such date is printed or you can't confidently read it.
- deadlines: list every date the recipient must act by (pay, submit, respond) with no physical presence required. If no deadline exists, return an empty array. Descriptions written in ${LANGUAGE_NAMES[language]}.
- payments: this is critical — re-read the letter specifically looking for every payment amount or payment change (an amount owed, a new or changed fee, an installment, a partial payment already made). This is often the single most consequential number in the letter and must never be missed. Each entry needs description in ${LANGUAGE_NAMES[language]}, the amount exactly as written (never rounded or reformatted), and source_quote copied verbatim in the ORIGINAL GERMAN. Empty array only if the letter truly has no payment component.
- appointments: list every fixed date/time the recipient must physically be present for or attend — an inspection, a hearing, a medical appointment, a scheduled visit. If the letter only asks them to pick or confirm a time (no fixed slot yet), that belongs in deadlines instead, not here. Descriptions written in ${LANGUAGE_NAMES[language]}; date is ISO 8601 plus a time if one is given; source_quote copied verbatim in the ORIGINAL GERMAN. Empty array if there's no fixed appointment.
- key_facts: pull out concrete facts worth backing with the original text — reference numbers, names, non-payment figures. Each fact needs label and value written in ${LANGUAGE_NAMES[language]}, plus source_quote copied verbatim in the ORIGINAL GERMAN regardless of target language, so the reader can see exactly what the letter said. Empty array if there's nothing worth citing this way. Don't duplicate deadlines, payments, or appointments here.
- action_required: true if the recipient must do something (pay, respond, submit, appear) by a deadline or in general; false for purely informational letters.
- reply_draft: write a complete, ready-to-send reply appropriate to the sender, formal and correct — written entirely in GERMAN, regardless of the target language, because the recipient reads German. ${SENDER_INSTRUCTION}
- reply_draft_translation: translate reply_draft's exact meaning into ${LANGUAGE_NAMES[language]}, so the person can understand what they're about to send before they send it. This is a translation of reply_draft, not an independent reply.
- detected_language_confirmed: false if the source text seems too garbled/unclear to be confident it was German.
- risk_flags: if any amount, date, or instruction is ambiguous or you are not fully confident you read it correctly, add a plain-language warning here instead of guessing. Never silently guess at a number or date you're unsure about. Written in ${LANGUAGE_NAMES[language]}.`;
}

const RETRYABLE_STATUSES = new Set([429, 503]);
// gemini-flash-latest's free tier occasionally needs more than one retry to
// ride out a demand spike (observed: two consecutive 503s before a third
// attempt succeeded) — a third attempt with more backoff room turns more of
// these into an automatic success instead of a user-facing failure.
const RETRY_DELAYS_MS = [500, 1500, 3000];

function isRetryableStatus(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  return typeof status === "number" && RETRYABLE_STATUSES.has(status);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gemini occasionally returns 503 ("This model is currently experiencing
 * high demand... please try again later") or 429 (rate limit) — both
 * explicitly transient per Google's own error message. Retrying a couple
 * times with a short backoff turns most of these into a slightly slower
 * success instead of a user-facing failure that requires a manual retry.
 */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_DELAYS_MS.length && isRetryableStatus(error)) {
        console.warn(`Gemini call failed (attempt ${attempt + 1}), retrying`, error);
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      throw lastError;
    }
  }
  throw lastError;
}

function parseResponse<T>(text: string | undefined): Result<T> {
  if (!text) {
    return {
      ok: false,
      error: { code: "ANALYSIS_FAILED", message: "The analysis came back empty.", recovery: "Try again." },
    };
  }
  try {
    const parsed = JSON.parse(text) as T;
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      error: { code: "ANALYSIS_FAILED", message: "The analysis came back in an unexpected format.", recovery: "Try again." },
    };
  }
}

/**
 * Handles both images (JPEG/PNG) and PDFs uniformly — Gemini reads either
 * directly as document/vision input via inlineData, so no separate OCR
 * pre-step is needed for PDFs (unlike the OpenAI-vision pipeline this was
 * originally scoped against, Gemini has native PDF document understanding).
 */
export async function analyzeDocument(
  bytes: Buffer,
  mimeType: string,
  language: AppLanguage,
  sender?: SenderInfo,
): Promise<Result<LetterAnalysis>> {
  try {
    const ai = createGeminiClient();
    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          { inlineData: { data: bytes.toString("base64"), mimeType } },
          "Read this German letter and produce the required JSON analysis.",
        ],
        config: {
          systemInstruction: buildSystemInstruction(language, sender),
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    );
    return parseResponse<LetterAnalysis>(response.text);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    Sentry.captureException(error, { tags: { geminiCall: "analyzeDocument" } });
    return {
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "Analysis failed — try again.",
        recovery: "Check your connection and try uploading again.",
      },
    };
  }
}

const REPLY_DRAFT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply_draft: {
      type: Type.STRING,
      description: "A ready-to-send reply letter, written in GERMAN, appropriate to the sender and formal enough for official correspondence.",
    },
    reply_draft_translation: {
      type: Type.STRING,
      description: "The reply_draft's meaning translated into the target language, so the reader understands what they're about to send.",
    },
    answer_understood: {
      type: Type.BOOLEAN,
      description: "True if the user's answer (if the context includes one) was coherent and relevant to replying to this letter. Always true if the context includes no user answer.",
    },
    answer_clarification: {
      type: Type.STRING,
      description: "If answer_understood is false, a short, friendly explanation — in the target language — of what was unclear and what kind of answer is needed instead. Empty string if answer_understood is true.",
    },
  },
  required: ["reply_draft", "reply_draft_translation", "answer_understood", "answer_clarification"],
  propertyOrdering: ["reply_draft", "reply_draft_translation", "answer_understood", "answer_clarification"],
};

export type TranslatableLetterContent = {
  summary: string;
  deadlines: { date: string; description: string }[];
  riskFlags: string[];
  payments: { description: string; amount: string; source_quote: string }[];
  appointments: { description: string; date: string; source_quote: string }[];
  keyFacts: { label: string; value: string; source_quote: string }[];
  replyDraftTranslation: string;
};

const TRANSLATE_CONTENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    deadline_descriptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Translated deadline descriptions, same count and order as given.",
    },
    risk_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
    payment_descriptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Translated payment descriptions, same count and order as given. Amounts and source quotes are not translated.",
    },
    appointment_descriptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Translated appointment descriptions, same count and order as given. Dates and source quotes are not translated.",
    },
    key_fact_labels: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Translated key-fact labels, same count and order as given.",
    },
    key_fact_values: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Translated key-fact values, same count and order as given.",
    },
    reply_draft_translation: { type: Type.STRING },
  },
  required: ["summary", "deadline_descriptions", "risk_flags", "payment_descriptions", "appointment_descriptions", "key_fact_labels", "key_fact_values", "reply_draft_translation"],
  propertyOrdering: ["summary", "deadline_descriptions", "risk_flags", "payment_descriptions", "appointment_descriptions", "key_fact_labels", "key_fact_values", "reply_draft_translation"],
};

type TranslateContentResponse = {
  summary: string;
  deadline_descriptions: string[];
  risk_flags: string[];
  payment_descriptions: string[];
  appointment_descriptions: string[];
  key_fact_labels: string[];
  key_fact_values: string[];
  reply_draft_translation: string;
};

/**
 * Translates an already-analyzed letter's user-facing text into a new
 * target language, without re-reading the original image — cheaper and
 * faster than a full re-analysis, and the structured content already
 * captures everything worth translating. Dates and source_quote (always
 * the original German, per spec) are never sent to the model; the
 * response is zipped back onto the original deadlines/key_facts arrays by
 * index, not re-derived, so those fields can't drift.
 */
export async function translateLetterContent(
  content: TranslatableLetterContent,
  targetLanguage: AppLanguage,
): Promise<Result<TranslatableLetterContent>> {
  try {
    const ai = createGeminiClient();
    const prompt = [
      `Summary: ${content.summary}`,
      `Deadline descriptions (${content.deadlines.length} items, in order): ${JSON.stringify(content.deadlines.map((d) => d.description))}`,
      `Risk flags (${content.riskFlags.length} items, in order): ${JSON.stringify(content.riskFlags)}`,
      `Payment descriptions (${content.payments.length} items, in order): ${JSON.stringify(content.payments.map((p) => p.description))}`,
      `Appointment descriptions (${content.appointments.length} items, in order): ${JSON.stringify(content.appointments.map((a) => a.description))}`,
      `Key fact labels (${content.keyFacts.length} items, in order): ${JSON.stringify(content.keyFacts.map((f) => f.label))}`,
      `Key fact values (${content.keyFacts.length} items, in order): ${JSON.stringify(content.keyFacts.map((f) => f.value))}`,
      `Reply translation: ${content.replyDraftTranslation}`,
    ].join("\n");

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [`${prompt}\n\nRespond ONLY with the JSON object matching the required schema.`],
        config: {
          systemInstruction: `You translate an already-extracted structured analysis of a German postal letter into ${LANGUAGE_NAMES[targetLanguage]}. Translate meaning faithfully — do not summarize further, add, remove, or reorder items. Every array in your response must have exactly the same number of items, in the same order, as the corresponding array given to you. Dates and source quotes are handled separately and are not part of this task.`,
          responseMimeType: "application/json",
          responseSchema: TRANSLATE_CONTENT_SCHEMA,
          // Straight text-in/JSON-out translation of already-extracted
          // content — no extraction or judgment call involved, so the
          // model's thinking-token budget buys nothing here.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    );

    const parsed = parseResponse<TranslateContentResponse>(response.text);
    if (!parsed.ok) return parsed;
    const t = parsed.data;

    if (
      t.deadline_descriptions.length !== content.deadlines.length ||
      t.payment_descriptions.length !== content.payments.length ||
      t.appointment_descriptions.length !== content.appointments.length ||
      t.key_fact_labels.length !== content.keyFacts.length ||
      t.key_fact_values.length !== content.keyFacts.length
    ) {
      return {
        ok: false,
        error: { code: "ANALYSIS_FAILED", message: "The translation came back in an unexpected shape.", recovery: "Try again." },
      };
    }

    return {
      ok: true,
      data: {
        summary: t.summary,
        deadlines: content.deadlines.map((d, i) => ({ date: d.date, description: t.deadline_descriptions[i] })),
        riskFlags: t.risk_flags,
        payments: content.payments.map((p, i) => ({
          description: t.payment_descriptions[i],
          amount: p.amount,
          source_quote: p.source_quote,
        })),
        appointments: content.appointments.map((a, i) => ({
          description: t.appointment_descriptions[i],
          date: a.date,
          source_quote: a.source_quote,
        })),
        keyFacts: content.keyFacts.map((f, i) => ({
          label: t.key_fact_labels[i],
          value: t.key_fact_values[i],
          source_quote: f.source_quote,
        })),
        replyDraftTranslation: t.reply_draft_translation,
      },
    };
  } catch (error) {
    console.error("Gemini content translation failed", error);
    Sentry.captureException(error, { tags: { geminiCall: "translateLetterContent" } });
    return {
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "Couldn't translate this letter — try again.",
        recovery: "Check your connection and try again.",
      },
    };
  }
}

/**
 * Regenerates just the reply in a user-picked tone (confirm / request more
 * time / object / ask for clarification first). Reuses the letter's already
 * -extracted summary/deadlines/risk_flags as context instead of re-sending
 * the original image — cheaper on Gemini's free-tier daily request quota,
 * and the structured analysis already captures everything a reply needs.
 */
export async function regenerateReplyDraft(
  letter: { summary: string; deadlines: { date: string; description: string }[]; riskFlags: string[] },
  tone: ReplyTone,
  language: AppLanguage,
  answer?: string,
  sender?: SenderInfo,
): Promise<Result<ReplyDraft>> {
  try {
    const ai = createGeminiClient();
    const context = [
      `Letter summary: ${letter.summary}`,
      letter.deadlines.length > 0
        ? `Deadlines: ${letter.deadlines.map((d) => `${d.date} — ${d.description}`).join("; ")}`
        : "Deadlines: none",
      letter.riskFlags.length > 0 ? `Uncertain points: ${letter.riskFlags.join("; ")}` : "Uncertain points: none",
      answer ? `The user's answer to work into the reply: ${answer}` : null,
      senderContextLine(sender),
    ].filter((line): line is string => line !== null).join("\n");

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          `${context}\n\n${REPLY_TONE_INSTRUCTIONS[tone]}\n\nRespond ONLY with the JSON object matching the required schema.`,
        ],
        config: {
          systemInstruction: `You draft replies to official German postal letters on behalf of someone who cannot read German confidently. reply_draft must be written entirely in GERMAN, formal and correct, since the recipient reads German. ${SENDER_INSTRUCTION} reply_draft_translation must translate reply_draft's exact meaning into ${LANGUAGE_NAMES[language]}. If the context above includes a line starting with "The user's answer to work into the reply" and that text is gibberish, empty of real meaning, spam, or unrelated to responding to this letter, set answer_understood to false, write answer_clarification in ${LANGUAGE_NAMES[language]} explaining what's needed instead, and do not try to force that answer into reply_draft. If there is no such line, or the answer is coherent, set answer_understood to true and leave answer_clarification as an empty string.`,
          responseMimeType: "application/json",
          responseSchema: REPLY_DRAFT_SCHEMA,
          // A short templated reply from already-extracted context, not a
          // reasoning task — skip the thinking-token budget here too.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    );
    return parseResponse<ReplyDraft>(response.text);
  } catch (error) {
    console.error("Gemini reply regeneration failed", error);
    Sentry.captureException(error, { tags: { geminiCall: "regenerateReplyDraft" } });
    return {
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "Couldn't draft that reply — try again.",
        recovery: "Check your connection and try again.",
      },
    };
  }
}
