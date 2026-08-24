import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";

export function createGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

// Pinned to an explicit stable version, not "-latest" — an alias silently
// repointed at gemini-3.7-flash, whose free-tier daily quota (20 requests)
// broke production with no code change or deploy on our end. gemini-2.5-flash
// was tried first but is no longer available to this project (404 from the
// API); gemini-3.6-flash is confirmed reachable and GA (not preview).
export const GEMINI_MODEL = "gemini-3.6-flash";
