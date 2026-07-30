"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";

const LANGUAGES: AppLanguage[] = ["en", "ar", "tr"];

export async function changeLanguage(language: AppLanguage): Promise<Result<null>> {
  if (!LANGUAGES.includes(language)) {
    return { ok: false, error: { code: "INVALID_INPUT", message: "Unsupported language." } };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Please log in again." } };
  }

  const { error } = await supabase.from("profiles").update({ language }).eq("id", user.id);

  if (error) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: "Couldn't update your language.", recovery: "Try again." },
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/upload");
  return { ok: true, data: null };
}
