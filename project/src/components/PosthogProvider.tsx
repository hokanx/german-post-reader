"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";

export function PosthogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  }, []);

  return <>{children}</>;
}
