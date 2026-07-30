import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";

export function createGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export const GEMINI_MODEL = "gemini-flash-latest";
