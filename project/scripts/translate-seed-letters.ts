/**
 * One-off tool: translates the seed LETTERS (src/lib/seed/letters-data.ts)
 * into ar/tr using the real Gemini translation pipeline
 * (translateLetterContent), and caches the result to
 * scripts/.seed-translations.json so apply-demo-language.ts can apply any
 * of the three languages to the demo account without re-calling Gemini.
 *
 * The free-tier Gemini quota is 5 requests/minute, so this paces calls
 * ~13s apart and saves the cache after every single letter (not just at
 * the end) so a rate-limit failure partway through loses no progress —
 * re-running just resumes from the first untranslated letter.
 *
 * Run with: npx tsx scripts/translate-seed-letters.ts
 */
import path from "node:path";
import fs from "node:fs/promises";
import { LETTERS, type SeedLetter } from "../src/lib/seed/letters-data";
import type { TranslatableLetterContent } from "../src/lib/gemini/analyze-letter";
import type { AppLanguage } from "../src/lib/letters/types";

// Static imports are hoisted and evaluated before this runs, so anything
// that reads process.env at module-load time (src/lib/env.ts, via the
// gemini client) must be imported dynamically, after loadEnvFile below.
process.loadEnvFile(path.resolve(__dirname, "../.env.local"));

const CACHE_PATH = path.resolve(__dirname, ".seed-translations.json");
const TARGET_LANGUAGES: AppLanguage[] = ["ar", "tr"];
const CALL_SPACING_MS = 13_000;
const MAX_RETRIES = 5;

type CacheFile = {
  [language: string]: (TranslatableLetterContent | null)[];
};

function toTranslatable(letter: SeedLetter): TranslatableLetterContent {
  return {
    summary: letter.summary,
    deadlines: letter.deadlines,
    riskFlags: letter.risk_flags,
    payments: letter.payments,
    appointments: letter.appointments,
    keyFacts: letter.key_facts,
    replyDraftTranslation: letter.reply_draft_translation,
  };
}

async function loadCache(): Promise<CacheFile> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw) as CacheFile;
  } catch {
    return {};
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { translateLetterContent } = await import("../src/lib/gemini/analyze-letter");
  const cache = await loadCache();

  for (const lang of TARGET_LANGUAGES) {
    const results: (TranslatableLetterContent | null)[] = cache[lang] ?? new Array(LETTERS.length).fill(null);
    cache[lang] = results;

    for (let i = 0; i < LETTERS.length; i++) {
      if (results[i]) {
        console.log(`[${lang}] (${i + 1}/${LETTERS.length}) ${LETTERS[i].sender} — cached, skipping`);
        continue;
      }

      const letter = LETTERS[i];
      const content = toTranslatable(letter);

      let attempt = 0;
      for (;;) {
        await sleep(CALL_SPACING_MS);
        const result = await translateLetterContent(content, lang);
        if (result.ok) {
          results[i] = result.data;
          cache[lang] = results;
          await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
          console.log(`[${lang}] (${i + 1}/${LETTERS.length}) ${letter.sender} — done`);
          break;
        }

        attempt++;
        if (attempt >= MAX_RETRIES) {
          throw new Error(`[${lang}] gave up translating letter ${i} (${letter.sender}) after ${MAX_RETRIES} attempts: ${result.error.message}`);
        }
        console.warn(`[${lang}] (${i + 1}/${LETTERS.length}) ${letter.sender} — retry ${attempt}/${MAX_RETRIES}: ${result.error.message}`);
      }
    }
  }

  console.log("All translations complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
