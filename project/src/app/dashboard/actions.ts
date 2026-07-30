"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { AppLanguage } from "@/lib/letters/types";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

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
  return { ok: true, data: null };
}
