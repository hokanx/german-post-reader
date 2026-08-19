import type { SupabaseClient } from "@supabase/supabase-js";
import type { Result } from "@/lib/result";

/**
 * Counts registered accounts for the landing page's social-proof counter,
 * minus the one fixed seed/demo account (`demo@germanpostreader.app`,
 * created by `lib/seed/seed.ts`) so internal testing never inflates a
 * number meant to represent real signups. The seed script's find-or-create
 * check guarantees at most one such account ever exists, so subtracting a
 * fixed 1 is exact — no per-request lookup needed.
 *
 * Returns a Result instead of coercing a query failure to 0: a DB outage or
 * misconfiguration is not the same thing as "nobody has signed up yet", and
 * the two must never render identically on the landing page.
 */
export async function countRegisteredUsers(service: SupabaseClient): Promise<Result<number>> {
  const { count, error } = await service.from("profiles").select("*", { count: "exact", head: true });

  if (error) {
    return {
      ok: false,
      error: {
        code: "count_registered_failed",
        message: "Couldn't count registered users.",
        recovery: "Try again shortly.",
      },
    };
  }

  return { ok: true, data: Math.max((count ?? 0) - 1, 0) };
}
