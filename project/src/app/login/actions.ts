"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Enter your password"),
});

export async function login(formData: FormData): Promise<Result<null>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues[0]?.message ?? "Enter your email and password.",
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
          message: "That email and password don't match.",
          recovery: "Check for typos, or reset your password.",
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
