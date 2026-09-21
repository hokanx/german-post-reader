import { PostHog } from "posthog-node";
import { env } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Server-side event capture — used only where the event genuinely originates
 * server-side (the Stripe webhook has no browser context to capture from).
 * No-ops safely if NEXT_PUBLIC_POSTHOG_KEY isn't configured.
 *
 * Consent is checked HERE rather than at each call site, so that every
 * present and future caller is gated by construction. The browser gate
 * (PosthogProvider) can't cover these paths: the Stripe webhook is called by
 * Stripe and the deletion action outlives the session, so neither can read
 * the `consent_analytics` cookie. Reading the persisted decision from
 * `profiles.analytics_consent` (migration 0017) is what makes the privacy
 * policy's "only if you accepted the cookie banner" actually true.
 *
 * A missing profile, an unreadable one, or consent not granted all mean the
 * same thing: do not capture.
 */
export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;

  const { data: profile, error } = await createServiceClient()
    .from("profiles")
    .select("analytics_consent")
    .eq("id", distinctId)
    .maybeSingle();

  if (error) {
    console.error("trackServerEvent: consent lookup failed, not capturing", error);
    return;
  }
  if (!profile?.analytics_consent) return;

  const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  });
  client.capture({ distinctId, event, properties });
  await client.shutdown();
}
