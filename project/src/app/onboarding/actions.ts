"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";

const LANGUAGES = ["en", "ar", "tr"] as const;
type Language = (typeof LANGUAGES)[number];

export async function setLanguage(language: Language): Promise<Result<null>> {
  if (!LANGUAGES.includes(language)) {
    return {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Unsupported language." },
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
        message: "Couldn't save your language preference.",
        recovery: "Try again.",
      },
    };
  }

  redirect("/dashboard");
}
