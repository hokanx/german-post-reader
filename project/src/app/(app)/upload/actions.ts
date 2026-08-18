"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { analyzeDocument } from "@/lib/gemini/analyze-letter";
import { DAILY_LETTER_LIMIT, FREE_LETTER_LIMIT, MAX_UPLOAD_BYTES, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { matchesDeclaredType } from "@/lib/file-signature";
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

  // The client pre-checks this too (upload-form.tsx), but that's a UX
  // nicety only — a request can always bypass client-side JavaScript, so
  // this is the real boundary.
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: copy.fileTooLarge,
        recovery: file.type === "application/pdf" ? copy.fileTooLargePdfRecovery : copy.fileTooLargeImageRecovery,
      },
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // The browser-supplied Content-Type on a multipart upload is whatever the
  // client claims it is, not a guarantee of the file's actual content — an
  // attacker can label anything "image/png". Checking the real magic bytes
  // closes that gap before the file is ever sent to Gemini or stored.
  if (!matchesDeclaredType(bytes, file.type)) {
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

  const analysisResult = await analyzeDocument(bytes, file.type, language, {
    fullName: profile.full_name,
    postalAddress: profile.postal_address,
  });

  if (!analysisResult.ok) {
    return {
      ok: false,
      error: { code: analysisResult.error.code, message: copy.analysisFailed, recovery: copy.analysisFailedRecovery },
    };
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
    sender_name: analysis.sender_name,
    sender_category: analysis.sender_category,
    deadlines: analysis.deadlines,
    payments: analysis.payments,
    appointments: analysis.appointments,
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

  // Seeds the translation cache with the language this letter was already
  // analyzed in — free, since that content already exists — so switching
  // back to it later is a cache read instead of a re-translation. Best-effort:
  // a failed write here just costs one extra Gemini call the first time the
  // user switches back, not the upload itself.
  await service.from("letter_translations").insert({
    letter_id: letterId,
    language,
    summary: analysis.summary,
    deadlines: analysis.deadlines,
    risk_flags: analysis.risk_flags,
    payments: analysis.payments,
    appointments: analysis.appointments,
    key_facts: analysis.key_facts,
    reply_draft_translation: analysis.reply_draft_translation,
  });

  await service
    .from("profiles")
    .update({ trial_letters_used: profile.trial_letters_used + 1 })
    .eq("id", user.id);

  return { ok: true, data: { letterId } };
}
