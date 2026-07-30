"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/email/send-welcome-email";
import type { Result } from "@/lib/result";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(
  formData: FormData,
): Promise<Result<null>> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues[0]?.message ?? "Check your email and password.",
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
          message: "An account with this email already exists.",
          recovery: "Try logging in instead.",
        },
      };
    }
    if (error.code === "weak_password") {
      return {
        ok: false,
        error: {
          code: "WEAK_PASSWORD",
          message: "That password is too weak.",
          recovery: "Use at least 8 characters with a mix of letters and numbers.",
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
        message: "Signup did not return a user.",
        recovery: "Try again in a moment.",
      },
    };
  }

  const service = createServiceClient();
  const { error: profileError } = await service.from("profiles").insert({
    id: user.id,
    subscription_status: "trialing",
    trial_letters_used: 0,
  });

  if (profileError) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: "Your account was created but setup failed.",
        recovery: "Try logging in — if this keeps happening, contact support.",
      },
    };
  }

  await sendWelcomeEmail(email);

  redirect("/onboarding");
}
