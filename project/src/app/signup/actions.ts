"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/email/send-welcome-email";
import { addToLaunchAudience } from "@/lib/email/add-to-launch-audience";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

// Account creation is the entry point to every other limit in the app (free
// letter quota, Gemini calls), so this is deliberately tighter than login's.
const SIGNUP_RATE_LIMIT = 5;
const SIGNUP_RATE_WINDOW_SECONDS = 60 * 60;

export async function signup(
  formData: FormData,
  language: AppLanguage = "en",
): Promise<Result<null>> {
  const copy = APP_COPY[language].auth.errors;

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`signup:${ip}`, SIGNUP_RATE_LIMIT, SIGNUP_RATE_WINDOW_SECONDS);
  if (!allowed) {
    return {
      ok: false,
      error: { code: "RATE_LIMITED", message: copy.tooManyAttempts, recovery: copy.tooManyAttemptsRecovery },
    };
  }

  const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, copy.passwordTooShort),
  });

  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues[0]?.message ?? copy.checkEmailPassword,
      },
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        ok: false,
        error: {
          code: "EMAIL_IN_USE",
          message: copy.emailInUse,
          recovery: copy.emailInUseRecovery,
        },
      };
    }
    if (error.code === "weak_password") {
      return {
        ok: false,
        error: {
          code: "WEAK_PASSWORD",
          message: copy.weakPassword,
          recovery: copy.weakPasswordRecovery,
        },
      };
    }
    console.error("signup: unmapped Supabase auth error", error);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.unexpectedError,
        recovery: copy.unexpectedErrorRecovery,
      },
    };
  }

  const user = data.user;
  if (!user) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.signupNoUser,
        recovery: copy.signupNoUserRecovery,
      },
    };
  }

  const service = createServiceClient();
  const { error: profileError } = await service.from("profiles").insert({
    id: user.id,
    has_active_subscription: false,
    trial_letters_used: 0,
  });

  if (profileError) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.accountSetupFailed,
        recovery: copy.accountSetupFailedRecovery,
      },
    };
  }

  await sendWelcomeEmail(email, language);

  if (formData.get("newsletterOptIn") === "on") {
    await addToLaunchAudience(email);
  }

  redirect("/onboarding");
}
