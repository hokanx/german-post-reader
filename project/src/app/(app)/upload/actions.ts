"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { analyzeDocument } from "@/lib/gemini/analyze-letter";
import { DAILY_LETTER_LIMIT, FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export async function uploadLetter(
  formData: FormData,
): Promise<Result<{ letterId: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Language isn't known yet without a profile row, so these two guard
  // clauses (unauthenticated / no file chosen) necessarily stay English —
  // everything after the profile fetch below uses the real language.
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY.en.upload.pleaseLoginAgain } };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: { code: "INVALID_INPUT", message: APP_COPY.en.upload.chooseFileFirst } };
  }

  const service = createServiceClient();

  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("language, has_active_subscription, trial_letters_used, full_name, postal_address")
    .eq("id", user.id)
    .single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language].upload;

  if (profileError || !profile) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: copy.accountLoadFailed, recovery: copy.accountLoadFailedRecovery },
    };
  }

  const isSupported = ACCEPTED_IMAGE_TYPES.has(file.type) || file.type === "application/pdf";
  if (!isSupported) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: copy.unsupportedFileType,
      },
    };
  }

  if (!profile.has_active_subscription && profile.trial_letters_used >= FREE_LETTER_LIMIT) {
    return {
      ok: false,
      error: {
        code: "TRIAL_LIMIT_REACHED",
        message: copy.trialLimitReached(FREE_LETTER_LIMIT),
        recovery: copy.trialLimitReachedRecovery(formatEur(SUBSCRIPTION_PRICE_EUR)),
      },
    };
  }

  // Unlimited plan still gets a generous daily backstop — Gemini cost per
  // letter is near-zero, so this isn't about cost, it's about a bug or a
  // single bad actor not being able to turn "unlimited" into a real bill.
  if (profile.has_active_subscription) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const { count, error: countError } = await service
      .from("letters")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", dayStart.toISOString());

    if (!countError && (count ?? 0) >= DAILY_LETTER_LIMIT) {
      return {
        ok: false,
        error: {
          code: "DAILY_LIMIT_REACHED",
          message: copy.dailyLimitReached,
          recovery: copy.dailyLimitReachedRecovery,
        },
      };
    }
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const analysisResult = await analyzeDocument(bytes, file.type, language, {
    fullName: profile.full_name,
    postalAddress: profile.postal_address,
  });

  if (!analysisResult.ok) {
    return analysisResult;
  }

  const letterId = randomUUID();
  const storagePath = `${user.id}/${letterId}`;

  const { error: uploadError } = await service.storage
    .from("letters")
    .upload(storagePath, bytes, { contentType: file.type });

  if (uploadError) {
    console.error("Letter storage upload failed", uploadError);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.letterSaveFailed,
        recovery: copy.letterSaveFailedRecovery,
      },
    };
  }

  const analysis = analysisResult.data;
  const { error: insertError } = await service.from("letters").insert({
    id: letterId,
    user_id: user.id,
    storage_path: storagePath,
    summary: analysis.summary,
    deadlines: analysis.deadlines,
    key_facts: analysis.key_facts,
    action_required: analysis.action_required,
    reply_draft: analysis.reply_draft,
    reply_draft_translation: analysis.reply_draft_translation,
    detected_language_confirmed: analysis.detected_language_confirmed,
    risk_flags: analysis.risk_flags,
    language,
  });

  if (insertError) {
    console.error("Letter insert failed", insertError);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.letterSaveFailed,
        recovery: copy.letterSaveFailedRecovery,
      },
    };
  }

  await service
    .from("profiles")
    .update({ trial_letters_used: profile.trial_letters_used + 1 })
    .eq("id", user.id);

  return { ok: true, data: { letterId } };
}
