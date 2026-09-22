"use client";

import { useEffect, type ReactNode } from "react";
import { flushQueuedEvents } from "@/lib/analytics/track-event";
import { loadPosthog } from "@/lib/analytics/posthog-client";
import { setAnalyticsConsent } from "@/lib/profile/actions";

const CONSENT_COOKIE = "consent_analytics";
const CONSENT_GRANTED_EVENT = "papkram:consent-granted";

function hasAnalyticsConsent() {
  return document.cookie.split("; ").includes(`${CONSENT_COOKIE}=granted`);
}

/**
 * posthog-js is imported HERE, inside the consent branch, rather than at
 * module scope — see posthog-client.ts. A static import put 62.5 KB brotli
 * into the initial bundle of every route, including the legal and auth pages
 * and every visitor who never grants consent.
 */
async function initPosthog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  const posthog = await loadPosthog();
  if (posthog.__loaded) return;

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
      void initPosthog();
      // Mirrors an already-granted cookie into the profile so server-side
      // capture can honour it. Without this, anyone who consented before
      // migration 0017 would keep a granted cookie and a `false` column, and
      // their subscription/deletion events would be dropped for ever.
      //
      // Guarded by a session-scoped marker: the provider is in the root
      // layout, so this previously fired a server action plus two Supabase
      // round-trips on EVERY page load — including anonymous landing visits,
      // where it does nothing but pay for an auth check. Once per tab is
      // enough to close the migration gap.
      void syncConsentOncePerSession();
    }

    function handleGranted() {
      void initPosthog();
      void syncConsentOncePerSession();
    }

    window.addEventListener(CONSENT_GRANTED_EVENT, handleGranted);
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, handleGranted);
  }, []);

  return <>{children}</>;
}

const CONSENT_SYNCED_KEY = "papkram:consent-synced";

async function syncConsentOncePerSession() {
  try {
    if (sessionStorage.getItem(CONSENT_SYNCED_KEY) === "1") return;
  } catch {
    // Private mode or blocked storage — fall through and just sync.
  }
  await setAnalyticsConsent(true);
  try {
    sessionStorage.setItem(CONSENT_SYNCED_KEY, "1");
  } catch {
    // Not being able to remember is harmless; worst case we sync again.
  }
}
