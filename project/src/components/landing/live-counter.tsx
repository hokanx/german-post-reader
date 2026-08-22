"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 30_000;

/**
 * The pulsing-dot signup counter shown in both the hero and the final CTA
 * band. `registeredCount` is `null` when the count couldn't be determined
 * (Supabase query error, service client failing to construct, etc.) —
 * that renders as the counter being genuinely absent, never as a false
 * "0 signed up". Server-rendered count is the first paint; polling keeps
 * it live for anyone who lingers on the page without a refresh.
 */
export function LiveCounter({
  registeredCount,
  label,
  tone = "light",
}: {
  registeredCount: number | null;
  label: string;
  tone?: "light" | "dark";
}) {
  const [liveCount, setLiveCount] = useState(registeredCount);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/registered-count");
        if (!response.ok) return;
        const data: { count: number | null } = await response.json();
        if (data.count !== null) {
          setLiveCount(data.count);
        }
      } catch (error) {
        console.error("registered-count poll failed", error);
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (liveCount === null) return null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border-2 border-border py-2.5 ps-3.5 pe-4.5 ${
        tone === "dark" ? "bg-primary-foreground/[0.16]" : "bg-background"
      }`}
    >
      <span
        className={`size-2.5 shrink-0 rounded-full ${tone === "dark" ? "bg-accent" : "bg-primary"} animate-pulse`}
        aria-hidden="true"
      />
      <span className={`font-mono text-[15px] font-medium ${tone === "dark" ? "text-primary-foreground" : "text-foreground"}`}>
        {liveCount.toLocaleString()}
      </span>
      <span className={`text-sm ${tone === "dark" ? "text-primary-foreground/85" : "text-foreground/70"}`}>{label}</span>
    </div>
  );
}
