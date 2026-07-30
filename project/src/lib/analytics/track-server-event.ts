import { PostHog } from "posthog-node";
import { env } from "@/lib/env";

/**
 * Server-side event capture — used only where the event genuinely originates
 * server-side (the Stripe webhook has no browser context to capture from).
 * No-ops safely if NEXT_PUBLIC_POSTHOG_KEY isn't configured.
 */
export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;

  const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  });
  client.capture({ distinctId, event, properties });
  await client.shutdown();
}
