"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const LANGUAGES: AppLanguage[] = ["en", "ar", "tr", "de", "uk"];

// Generous enough for any real name/postal address (postal addresses run
// multi-line with a name, street, and country) while capping the write —
// there's no downstream length limit otherwise, since this goes straight
// into a text column and back out into a reply-draft letterhead.
const senderInfoSchema = z.object({
  fullName: z.string().max(200),
  postalAddress: z.string().max(500),
});

/** `currentLanguage` (still in effect since the switch hasn't succeeded yet) drives which language any error is shown in. */
export async function changeLanguage(
  language: AppLanguage,
  currentLanguage: AppLanguage = "en",
): Promise<Result<null>> {
  const copy = APP_COPY[currentLanguage].onboarding;

  if (!LANGUAGES.includes(language)) {
    return { ok: false, error: { code: "INVALID_INPUT", message: copy.unsupportedLanguage } };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY.en.upload.pleaseLoginAgain } };
  }

  const { error } = await supabase.from("profiles").update({ language }).eq("id", user.id);

  if (error) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: copy.saveFailed, recovery: copy.saveFailedRecovery },
    };
  }

  // Keeps <html lang> (read from this cookie in the root layout) in sync with
  // the profile language stored above — see get-locale.ts.
  const cookieStore = await cookies();
  cookieStore.set("marketing_locale", language, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  revalidatePath("/dashboard");
  revalidatePath("/upload");
  return { ok: true, data: null };
}

/**
 * Stores the sender's own name/address so reply drafts can use it as a real
 * letterhead instead of Gemini falling back to a bracketed placeholder.
 * Either field may be cleared by passing an empty string.
 */
export async function updateSenderInfo(
  fullName: string,
  postalAddress: string,
  language: AppLanguage = "en",
): Promise<Result<null>> {
  const copy = APP_COPY[language].settings;

  const parsed = senderInfoSchema.safeParse({ fullName, postalAddress });
  if (!parsed.success) {
    return { ok: false, error: { code: "INVALID_INPUT", message: copy.senderInfoTooLong } };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY.en.upload.pleaseLoginAgain } };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName.trim() || null,
      postal_address: parsed.data.postalAddress.trim() || null,
    })
    .eq("id", user.id);

  if (error) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: copy.senderInfoSaveFailed, recovery: copy.senderInfoSaveFailedRecovery },
    };
  }

  return { ok: true, data: null };
}
