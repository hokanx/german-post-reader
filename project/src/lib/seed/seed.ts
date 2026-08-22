/**
 * Dev/local seed script — populates a demo account with realistic letters
 * so the dashboard is never built against an empty table. Run with
 * `npm run seed`. Idempotent: re-running clears and re-inserts the demo
 * user's letters rather than duplicating them.
 */
import path from "node:path";
import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import { LETTERS } from "./letters-data";

process.loadEnvFile(path.resolve(__dirname, "../../../.env.local"));

faker.seed(42);

const DEMO_EMAIL = "demo@germanpostreader.app";
const DEMO_PASSWORD = "DemoAccount123!";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (check .env.local)");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Finding or creating demo user...");
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let demoUser = existingUsers.users.find((u) => u.email === DEMO_EMAIL);

  if (!demoUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`Failed to create demo user: ${error?.message}`);
    }
    demoUser = data.user;
    console.log(`Created demo user ${DEMO_EMAIL}`);
  } else {
    console.log(`Found existing demo user ${DEMO_EMAIL}`);
  }

  const userId = demoUser.id;

  await supabase.from("profiles").upsert({
    id: userId,
    language: "en",
    has_active_subscription: false,
    trial_letters_used: 1,
  });

  console.log("Clearing existing demo letters...");
  await supabase.from("letters").delete().eq("user_id", userId);

  console.log(`Inserting ${LETTERS.length} realistic letters...`);
  const rows = LETTERS.map((letter, i) => {
    const daysAgo = faker.number.int({ min: i * 2, max: i * 2 + 5 });
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const letterId = faker.string.uuid();
    return {
      id: letterId,
      user_id: userId,
      storage_path: `${userId}/${letterId}`,
      raw_ocr_text: null,
      summary: letter.summary,
      sender_name: letter.sender,
      sender_category: letter.sender_category,
      deadlines: letter.deadlines,
      payments: letter.payments,
      appointments: letter.appointments,
      key_facts: letter.key_facts,
      action_required: letter.action_required,
      reply_draft: letter.reply_draft,
      reply_draft_translation: letter.reply_draft_translation,
      detected_language_confirmed: true,
      risk_flags: letter.risk_flags,
      language: "en",
      created_at: createdAt,
    };
  });

  const { error: insertError } = await supabase.from("letters").insert(rows);
  if (insertError) {
    throw new Error(`Failed to insert letters: ${insertError.message}`);
  }

  console.log(`Seed complete. Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
