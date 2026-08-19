"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/email/send-welcome-email";
import { addToLaunchAudience } from "@/lib/email/add-to-launch-audience";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export async function signup(
  formData: FormData,
  language: AppLanguage = "en",
): Promise<Result<null>> {
  const copy = APP_COPY[language].auth.errors;
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
    return {
      ok: false,
      error: { code: "UNKNOWN", message: error.message },
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
