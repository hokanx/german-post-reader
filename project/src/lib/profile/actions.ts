"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const LANGUAGES: AppLanguage[] = ["en", "ar", "tr"];

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
      full_name: fullName.trim() || null,
      postal_address: postalAddress.trim() || null,
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
