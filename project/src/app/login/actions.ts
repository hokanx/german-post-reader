"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const LANGUAGES: readonly AppLanguage[] = ["en", "ar", "tr"];

// Generous enough that a real user mistyping a password a few times never
// notices — this exists to blunt scripted credential-stuffing, not to add
// friction to normal logins.
const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_SECONDS = 5 * 60;

export async function login(formData: FormData, language: AppLanguage = "en"): Promise<Result<null>> {
  const copy = APP_COPY[language].auth.errors;

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_SECONDS);
  if (!allowed) {
    return {
      ok: false,
      error: { code: "RATE_LIMITED", message: copy.tooManyAttempts, recovery: copy.tooManyAttemptsRecovery },
    };
  }

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
    console.error("login: unmapped Supabase auth error", error);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.unexpectedError,
        recovery: copy.unexpectedErrorRecovery,
      },
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
