import { Type } from "@google/genai";
import { createGeminiClient, GEMINI_MODEL } from "./client";
import { LANGUAGE_NAMES, type AppLanguage, type LetterAnalysis } from "@/lib/letters/types";
import type { Result } from "@/lib/result";

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
      description: "A ready-to-send reply letter, in the target language, appropriate to the sender (Behörde, bank, insurer, landlord, etc.).",
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
  required: ["summary", "deadlines", "reply_draft", "detected_language_confirmed", "risk_flags"],
  propertyOrdering: ["summary", "deadlines", "reply_draft", "detected_language_confirmed", "risk_flags"],
};

function buildSystemInstruction(language: AppLanguage) {
  return `You read official German postal letters (Behörde notices, bank mail, insurance, landlord letters) for someone who cannot read German confidently. Extract the letter's content, then respond ONLY with the JSON object matching the required schema, written entirely in ${LANGUAGE_NAMES[language]}.

Rules:
- summary: plain language, no legal jargon, explain what the letter is about and why it matters.
- deadlines: list every date the recipient must act by. If no deadline exists, return an empty array.
- reply_draft: write a complete, ready-to-send reply appropriate to the sender, in ${LANGUAGE_NAMES[language]}.
- detected_language_confirmed: false if the source text seems too garbled/unclear to be confident it was German.
- risk_flags: if any amount, date, or instruction is ambiguous or you are not fully confident you read it correctly, add a plain-language warning here instead of guessing. Never silently guess at a number or date you're unsure about.`;
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

async function parseResponse(text: string | undefined): Promise<Result<LetterAnalysis>> {
  if (!text) {
    return {
      ok: false,
      error: { code: "ANALYSIS_FAILED", message: "The analysis came back empty.", recovery: "Try again." },
    };
  }
  try {
    const parsed = JSON.parse(text) as LetterAnalysis;
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
    return parseResponse(response.text);
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
