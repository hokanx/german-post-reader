"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import { APP_COPY } from "@/lib/i18n/copy";

const LANGUAGES = ["en", "ar", "tr"] as const;
type Language = (typeof LANGUAGES)[number];

/** `uiLanguage` is whatever the picker itself is currently displayed in (pre-auth cookie), not `language` (the value being chosen) — drives which language an error is shown in. */
export async function setLanguage(language: Language, uiLanguage: Language = "en"): Promise<Result<null>> {
  const copy = APP_COPY[uiLanguage].onboarding;

  if (!LANGUAGES.includes(language)) {
    return {
      ok: false,
      error: { code: "INVALID_INPUT", message: copy.unsupportedLanguage },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ language })
    .eq("id", user.id);

  if (error) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.saveFailed,
        recovery: copy.saveFailedRecovery,
      },
    };
  }

  redirect("/dashboard");
}
