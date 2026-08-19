"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";
import { flushQueuedEvents } from "@/lib/analytics/track-event";

const CONSENT_COOKIE = "consent_analytics";
const CONSENT_GRANTED_EVENT = "papkram:consent-granted";

function hasAnalyticsConsent() {
  return document.cookie.split("; ").includes(`${CONSENT_COOKIE}=granted`);
}

function initPosthog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || posthog.__loaded) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
  });
  // Replay any events fired (e.g. by descendant components' mount effects)
  // before this init call ran — see track-event.ts for why that ordering
  // happens even when consent was already granted.
  flushQueuedEvents();
}

/**
 * PostHog is non-essential tracking under §25 TTDSG, so it only loads after
 * explicit opt-in consent — either already granted on a prior visit, or
 * granted live via CookieConsentBanner's "papkram:consent-granted" event,
 * which lets analytics start this session without requiring a reload.
 */
export function PosthogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initPosthog();
    }

    function handleGranted() {
      initPosthog();
    }

    window.addEventListener(CONSENT_GRANTED_EVENT, handleGranted);
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, handleGranted);
  }, []);

  return <>{children}</>;
}
