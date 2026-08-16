"use client";

import { useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const CONSENT_COOKIE = "consent_analytics";
const CONSENT_GRANTED_EVENT = "papkram:consent-granted";

function readConsentCookie(): "granted" | "denied" | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
}

function writeConsentCookie(value: "granted" | "denied") {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

// Cookies aren't a React-observable store — there's nothing to subscribe to,
// we only need the value once per mount — but useSyncExternalStore is still
// the right tool: it's what lets a client-only read (document.cookie) settle
// in after hydration without a synchronous setState-in-effect.
function subscribe() {
  return () => {};
}

function getServerSnapshot(): "granted" | "denied" | null {
  return null;
}

/**
 * Shown once, before any non-essential tracker (PostHog) loads — required
 * as opt-in, not opt-out, under §25 TTDSG. Rendered in the root layout so it
 * applies to every page, pre-auth and authenticated alike.
 */
export function CookieConsentBanner({ language }: { language: AppLanguage }) {
  const copy = APP_COPY[language].cookieConsent;
  const [dismissed, setDismissed] = useState(false);
  const consent = useSyncExternalStore(subscribe, readConsentCookie, getServerSnapshot);

  if (dismissed || consent !== null) return null;

  function respond(value: "granted" | "denied") {
    writeConsentCookie(value);
    setDismissed(true);
    if (value === "granted") {
      window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
    }
  }

  return (
    <div
      role="region"
      aria-label={copy.ariaLabel}
      dir={language === "ar" ? "rtl" : "ltr"}
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border bg-card px-4 py-4 shadow-[0_-4px_0_0_var(--border)] sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-sm text-foreground">{copy.message}</p>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => respond("denied")}
            className="h-11 flex-1 rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => respond("granted")}
            className="h-11 flex-1 rounded-sm border-2 border-border bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
