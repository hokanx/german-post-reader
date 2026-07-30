"use client";

import posthog from "posthog-js";

/**
 * Browser-side event capture. No-ops safely if NEXT_PUBLIC_POSTHOG_KEY isn't
 * configured (posthog-js was never initialized) — never throws.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(name, properties);
}
