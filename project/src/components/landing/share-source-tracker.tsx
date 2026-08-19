"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track-event";

/** Fires once if the landing page was reached via a /welcome share link (`?src=share&via=...`) — the middle step of the share → landing → signup funnel. */
export function ShareSourceTracker({ src, via }: { src?: string; via?: string }) {
  useEffect(() => {
    if (src === "share") {
      trackEvent("demo_share_landing_view", { via });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
