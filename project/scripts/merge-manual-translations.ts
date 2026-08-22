/**
 * Fills gaps in scripts/.seed-translations.json using scripts/manual-
 * translations.ts (hand-written ar/tr text, used where the Gemini free
 * tier's daily quota ran out before translate-seed-letters.ts finished).
 * Leaves any already-cached (real Gemini) entry untouched. amount/date/
 * source_quote always come from the original English seed data — they are
 * never translated (see CLAUDE.md AI pipeline rules).
 *
 * Run with: npx tsx scripts/merge-manual-translations.ts
 */
import path from "node:path";
import fs from "node:fs/promises";
import { LETTERS } from "../src/lib/seed/letters-data";
import { AR, TR } from "./manual-translations";

const CACHE_PATH = path.resolve(__dirname, ".seed-translations.json");

type TranslatableLetterContent = {
  summary: string;
  deadlines: { date: string; description: string }[];
  riskFlags: string[];
  payments: { description: string; amount: string; source_quote: string }[];
  appointments: { description: string; date: string; source_quote: string }[];
  keyFacts: { label: string; value: string; source_quote: string }[];
  replyDraftTranslation: string;
};

type CacheFile = {
  [language: string]: (TranslatableLetterContent | null)[];
};

async function main() {
  const raw = await fs.readFile(CACHE_PATH, "utf-8").catch(() => "{}");
  const cache = JSON.parse(raw) as CacheFile;

  const sources: Record<string, (typeof AR)[number][]> = { ar: AR, tr: TR };

  for (const [lang, manualLetters] of Object.entries(sources)) {
    const results: (TranslatableLetterContent | null)[] = cache[lang] ?? new Array(LETTERS.length).fill(null);

    for (let i = 0; i < LETTERS.length; i++) {
      if (results[i]) continue; // already translated via real Gemini call
      const manual = manualLetters[i];
      if (!manual) continue; // no manual override either, leave as null

      const letter = LETTERS[i];
      results[i] = {
        summary: manual.summary,
        deadlines: letter.deadlines.map((d, j) => ({ date: d.date, description: manual.deadlineDescriptions[j] })),
        riskFlags: manual.riskFlags,
        payments: letter.payments.map((p, j) => ({
          description: manual.paymentDescriptions[j],
          amount: p.amount,
          source_quote: p.source_quote,
        })),
        appointments: letter.appointments.map((a, j) => ({
          description: manual.appointmentDescriptions[j],
          date: a.date,
          source_quote: a.source_quote,
        })),
        keyFacts: letter.key_facts.map((f, j) => ({
          label: manual.keyFactLabels[j],
          value: manual.keyFactValues[j],
          source_quote: f.source_quote,
        })),
        replyDraftTranslation: manual.replyDraftTranslation,
      };
    }

    cache[lang] = results;
    const missing = results.map((r, i) => (r ? null : LETTERS[i].sender)).filter((s): s is string => s !== null);
    console.log(`[${lang}] ${results.length - missing.length}/${results.length} filled${missing.length ? `, still missing: ${missing.join(", ")}` : ""}`);
  }

  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  console.log(`Wrote ${CACHE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
