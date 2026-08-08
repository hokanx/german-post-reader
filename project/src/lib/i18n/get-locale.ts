import { cookies } from "next/headers";
import type { AppLanguage } from "@/lib/letters/types";

const VALID: readonly AppLanguage[] = ["en", "ar", "tr"];

/**
 * Resolves UI language for pages rendered before a `profiles` row exists
 * (login, signup, onboarding's picker itself) — reuses the same
 * `marketing_locale` cookie the landing page's language switcher writes, so
 * whatever a visitor picked before signing up carries through the funnel.
 * Post-signup pages use `profiles.language` directly instead (see
 * dashboard/upload/letters, which already fetch it).
 */
export async function getPreAuthLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get("marketing_locale")?.value;
  return VALID.includes(value as AppLanguage) ? (value as AppLanguage) : "en";
}
