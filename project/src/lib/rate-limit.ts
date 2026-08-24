import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Vercel sets x-forwarded-for on every request; falls back to "unknown" for
 * local dev / anything that strips it, which just collapses all such
 * traffic into one shared bucket rather than failing open.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

/**
 * Fixed-window counter backed by Postgres (via the service-role client, so
 * RLS never applies here) rather than an external store — login/signup/
 * upload traffic is nowhere near the volume where Postgres row counts would
 * be a bottleneck, and it avoids wiring up a new third-party service just
 * for this. One row per attempt; a window's count is a COUNT(*) over `key`
 * within the lookback period.
 *
 * Opportunistic 2% cleanup of hits older than a day keeps the table bounded
 * without needing a separate cron job.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean }> {
  const service = createServiceClient();
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count } = await service
    .from("rate_limit_hits")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= limit) {
    return { allowed: false };
  }

  await service.from("rate_limit_hits").insert({ key });

  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await service.from("rate_limit_hits").delete().lt("created_at", cutoff);
  }

  return { allowed: true };
}
