"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { analyzeDocument } from "@/lib/gemini/analyze-letter";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import type { AppLanguage } from "@/lib/letters/types";
import type { Result } from "@/lib/result";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export async function uploadLetter(
  formData: FormData,
): Promise<Result<{ letterId: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Please log in again." } };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: { code: "INVALID_INPUT", message: "Choose a file to upload first." } };
  }

  const isSupported = ACCEPTED_IMAGE_TYPES.has(file.type) || file.type === "application/pdf";
  if (!isSupported) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Only JPEG, PNG, or PDF files are supported.",
      },
    };
  }

  const service = createServiceClient();

  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("language, has_lifetime_access, trial_letters_used")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: "Couldn't load your account.", recovery: "Try again." },
    };
  }

  if (!profile.has_lifetime_access && profile.trial_letters_used >= FREE_LETTER_LIMIT) {
    return {
      ok: false,
      error: {
        code: "TRIAL_LIMIT_REACHED",
        message: `You've used all ${FREE_LETTER_LIMIT} free letters.`,
        recovery: "Unlock unlimited letters for a one-time €5.99 payment.",
      },
    };
  }

  const language = (profile.language ?? "en") as AppLanguage;
  const bytes = Buffer.from(await file.arrayBuffer());

  const analysisResult = await analyzeDocument(bytes, file.type, language);

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
        message: "Your letter was analyzed but couldn't be saved.",
        recovery: "Try uploading again.",
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
        message: "Your letter was analyzed but couldn't be saved.",
        recovery: "Try uploading again.",
      },
    };
  }

  await service
    .from("profiles")
    .update({ trial_letters_used: profile.trial_letters_used + 1 })
    .eq("id", user.id);

  return { ok: true, data: { letterId } };
}
