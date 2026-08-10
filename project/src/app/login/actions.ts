"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const LANGUAGES: readonly AppLanguage[] = ["en", "ar", "tr"];

export async function login(formData: FormData, language: AppLanguage = "en"): Promise<Result<null>> {
  const copy = APP_COPY[language].auth.errors;
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, copy.enterPassword),
  });

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues[0]?.message ?? copy.enterEmailPassword,
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "invalid_credentials") {
      return {
        ok: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: copy.invalidCredentials,
          recovery: copy.invalidCredentialsRecovery,
        },
      };
    }
    return {
      ok: false,
      error: { code: "UNKNOWN", message: error.message },
    };
  }

  // Keeps <html lang> (read from this cookie in the root layout) in sync with
  // the profile language on every login — covers returning users whose
  // browser never had the cookie set (cleared cookies, new device, or an
  // account created before this cookie existed). See get-locale.ts.
  const { data: profile } = await supabase
    .from("profiles")
    .select("language")
    .eq("id", data.user.id)
    .single();
  if (profile?.language && LANGUAGES.includes(profile.language as AppLanguage)) {
    const cookieStore = await cookies();
    cookieStore.set("marketing_locale", profile.language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  redirect("/dashboard");
}
