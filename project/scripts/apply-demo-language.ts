/**
 * One-off tool: switches the demo account (and every seeded letter) to a
 * given language, for taking screenshots. Unlike the in-app language
 * switcher (which only changes profiles.language and leaves letter content
 * to auto-translate lazily, one letter at a time, on next view), this
 * writes the target-language content directly onto every seeded letter row
 * so the dashboard/deadlines list is fully translated immediately — no
 * "translating..." banners, no per-letter Gemini calls at screenshot time.
 *
 * Content for "en" comes from src/lib/seed/letters-data.ts (the pipeline's
 * own English seed copy); "ar"/"tr" come from the cache written by
 * translate-seed-letters.ts. reply_draft (always German), sender_name,
 * sender_category, and dates are never touched — only the
 * language-dependent fields are swapped.
 *
 * Run with: npx tsx scripts/apply-demo-language.ts <en|ar|tr|de|uk>
 * (de/uk require scripts/translate-seed-letters.ts to have cached
 * translations for that language first — see the cache check below.)
 */
import path from "node:path";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { LETTERS } from "../src/lib/seed/letters-data";

process.loadEnvFile(path.resolve(__dirname, "../.env.local"));

const DEMO_EMAIL = "demo@germanpostreader.app";
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
  const targetLanguage = process.argv[2];
  if (
    targetLanguage !== "en" &&
    targetLanguage !== "ar" &&
    targetLanguage !== "tr" &&
    targetLanguage !== "de" &&
    targetLanguage !== "uk"
  ) {
    throw new Error(`Usage: npx tsx scripts/apply-demo-language.ts <en|ar|tr|de|uk> (got "${targetLanguage}")`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (check .env.local)");
  }

  let translations: (TranslatableLetterContent | null)[] | null = null;
  if (targetLanguage !== "en") {
    const cache = JSON.parse(await fs.readFile(CACHE_PATH, "utf-8")) as CacheFile;
    translations = cache[targetLanguage];
    if (!translations || translations.length !== LETTERS.length || translations.some((t) => !t)) {
      throw new Error(`Cache at ${CACHE_PATH} is missing or incomplete for "${targetLanguage}" — run translate-seed-letters.ts first`);
    }
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const demoUser = existingUsers.users.find((u) => u.email === DEMO_EMAIL);
  if (!demoUser) {
    throw new Error(`Demo user ${DEMO_EMAIL} not found — run "npm run seed" first`);
  }
  const userId = demoUser.id;

  const { error: profileError } = await supabase.from("profiles").update({ language: targetLanguage }).eq("id", userId);
  if (profileError) {
    throw new Error(`Failed to update profile language: ${profileError.message}`);
  }
  console.log(`profiles.language -> ${targetLanguage}`);

  const { data: existingLetters, error: fetchError } = await supabase
    .from("letters")
    .select("id, sender_name")
    .eq("user_id", userId);
  if (fetchError || !existingLetters) {
    throw new Error(`Failed to fetch demo letters: ${fetchError?.message}`);
  }

  const idBySender = new Map(existingLetters.map((l) => [l.sender_name, l.id]));
  const letterIds: Record<string, string> = {};

  for (let i = 0; i < LETTERS.length; i++) {
    const letter = LETTERS[i];
    const letterId = idBySender.get(letter.sender);
    if (!letterId) {
      console.warn(`No existing letter row for "${letter.sender}" — skipping (run "npm run seed" first)`);
      continue;
    }
    letterIds[letter.sender] = letterId;

    const t = translations?.[i] ?? null;
    const update = t
      ? {
          language: targetLanguage,
          summary: t.summary,
          deadlines: t.deadlines,
          risk_flags: t.riskFlags,
          payments: t.payments,
          appointments: t.appointments,
          key_facts: t.keyFacts,
          reply_draft_translation: t.replyDraftTranslation,
        }
      : {
          language: targetLanguage,
          summary: letter.summary,
          deadlines: letter.deadlines,
          risk_flags: letter.risk_flags,
          payments: letter.payments,
          appointments: letter.appointments,
          key_facts: letter.key_facts,
          reply_draft_translation: letter.reply_draft_translation,
        };

    const { error: updateError } = await supabase.from("letters").update(update).eq("id", letterId);
    if (updateError) {
      throw new Error(`Failed to update letter "${letter.sender}": ${updateError.message}`);
    }
  }

  console.log(`Applied "${targetLanguage}" content to ${Object.keys(letterIds).length} letters.`);
  console.log("Letter IDs by sender:");
  console.log(JSON.stringify(letterIds, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
