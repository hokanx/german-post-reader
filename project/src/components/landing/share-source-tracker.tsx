"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import type { MarketingLocale } from "./locale-context";

/**
 * Fires once if the landing page was reached via a share link
 * (`?src=share&via=...`) — the middle step of the share → landing → signup
 * funnel. When that link also carried the sharer's language (`?lang=...`),
 * persists it to the `marketing_locale` cookie so it survives into
 * /signup and /login too, not just this one page load — the page.tsx
 * server component already used it for this page's own first paint (via
 * `initialLocale`), this just carries it forward.
 */
export function ShareSourceTracker({
  src,
  via,
  sharedLocale,
}: {
  src?: string;
  via?: string;
  sharedLocale?: MarketingLocale | null;
}) {
  useEffect(() => {
    if (src === "share") {
      trackEvent("demo_share_landing_view", { via });
    }
    if (sharedLocale) {
      document.cookie = `marketing_locale=${sharedLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
