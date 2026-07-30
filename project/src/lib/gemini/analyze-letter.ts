import { Type } from "@google/genai";
import { createGeminiClient, GEMINI_MODEL } from "./client";
import {
  LANGUAGE_NAMES,
  REPLY_TONE_INSTRUCTIONS,
  type AppLanguage,
  type LetterAnalysis,
  type ReplyTone,
} from "@/lib/letters/types";
import type { Result } from "@/lib/result";

type ReplyDraft = { reply_draft: string; reply_draft_translation: string };

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Plain-language summary of the letter, written for someone who doesn't read German.",
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
    "deadlines",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
  propertyOrdering: [
    "summary",
    "deadlines",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
};

function buildSystemInstruction(language: AppLanguage) {
  return `You read official German postal letters (Behörde notices, bank mail, insurance, landlord letters) for someone who cannot read German confidently. Extract the letter's content, then respond ONLY with the JSON object matching the required schema.

Rules:
- summary: plain language, no legal jargon, explain what the letter is about and why it matters. Written entirely in ${LANGUAGE_NAMES[language]}.
- deadlines: list every date the recipient must act by. If no deadline exists, return an empty array. Descriptions written in ${LANGUAGE_NAMES[language]}.
- reply_draft: write a complete, ready-to-send reply appropriate to the sender, formal and correct — written entirely in GERMAN, regardless of the target language, because the recipient reads German.
- reply_draft_translation: translate reply_draft's exact meaning into ${LANGUAGE_NAMES[language]}, so the person can understand what they're about to send before they send it. This is a translation of reply_draft, not an independent reply.
- detected_language_confirmed: false if the source text seems too garbled/unclear to be confident it was German.
- risk_flags: if any amount, date, or instruction is ambiguous or you are not fully confident you read it correctly, add a plain-language warning here instead of guessing. Never silently guess at a number or date you're unsure about. Written in ${LANGUAGE_NAMES[language]}.`;
}

const RETRYABLE_STATUSES = new Set([429, 503]);
const RETRY_DELAYS_MS = [500, 1500];

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
          systemInstruction: buildSystemInstruction(language),
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    );
    return parseResponse<LetterAnalysis>(response.text);
  } catch (error) {
    console.error("Gemini analysis failed", error);
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
  },
  required: ["reply_draft", "reply_draft_translation"],
  propertyOrdering: ["reply_draft", "reply_draft_translation"],
};

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
): Promise<Result<ReplyDraft>> {
  try {
    const ai = createGeminiClient();
    const context = [
      `Letter summary: ${letter.summary}`,
      letter.deadlines.length > 0
        ? `Deadlines: ${letter.deadlines.map((d) => `${d.date} — ${d.description}`).join("; ")}`
        : "Deadlines: none",
      letter.riskFlags.length > 0 ? `Uncertain points: ${letter.riskFlags.join("; ")}` : "Uncertain points: none",
    ].join("\n");

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          `${context}\n\n${REPLY_TONE_INSTRUCTIONS[tone]}\n\nRespond ONLY with the JSON object matching the required schema.`,
        ],
        config: {
          systemInstruction: `You draft replies to official German postal letters on behalf of someone who cannot read German confidently. reply_draft must be written entirely in GERMAN, formal and correct, since the recipient reads German. reply_draft_translation must translate reply_draft's exact meaning into ${LANGUAGE_NAMES[language]}.`,
          responseMimeType: "application/json",
          responseSchema: REPLY_DRAFT_SCHEMA,
        },
      }),
    );
    return parseResponse<ReplyDraft>(response.text);
  } catch (error) {
    console.error("Gemini reply regeneration failed", error);
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
