import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Counts registered accounts for the landing page's social-proof counter,
 * minus the one fixed seed/demo account (`demo@germanpostreader.app`,
 * created by `lib/seed/seed.ts`) so internal testing never inflates a
 * number meant to represent real signups. The seed script's find-or-create
 * check guarantees at most one such account ever exists, so subtracting a
 * fixed 1 is exact — no per-request lookup needed.
 */
export async function countRegisteredUsers(service: SupabaseClient): Promise<number> {
  const { count } = await service.from("profiles").select("*", { count: "exact", head: true });
  return Math.max((count ?? 0) - 1, 0);
}
