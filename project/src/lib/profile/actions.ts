"use server";

import { revalidatePath } from "next/cache";
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

  revalidatePath("/dashboard");
  revalidatePath("/upload");
  return { ok: true, data: null };
}
