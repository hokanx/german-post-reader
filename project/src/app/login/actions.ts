"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

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

  redirect("/dashboard");
}
