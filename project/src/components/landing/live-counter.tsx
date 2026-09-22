"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 30_000;

/**
 * One shared poller for however many counters are on the page.
 *
 * LiveCounter is rendered twice on the landing page — once in the hero and
 * once in the final CTA band — and each mount previously started its own
 * 30s interval. That made one open tab issue 4 requests/minute, each an
 * uncached serverless invocation running a service-role COUNT(*), all to
 * show a number that changed 10 times in 53 days.
 *
 * The interval is ref-counted: it starts when the first counter mounts and
 * stops when the last one unmounts, so nothing polls on a page with no
 * counter (e.g. when DEMO_MODE is off and the CTA band hides its own).
 */
const listeners = new Set<(count: number) => void>();
let timer: ReturnType<typeof setInterval> | null = null;

async function pollOnce() {
  try {
    const response = await fetch("/api/registered-count");
    if (!response.ok) return;
    const data: { count: number | null } = await response.json();
    if (data.count !== null) {
      for (const listener of listeners) listener(data.count);
    }
  } catch (error) {
    console.error("registered-count poll failed", error);
  }
}

function subscribeToCount(listener: (count: number) => void) {
  listeners.add(listener);
  if (timer === null) {
    timer = setInterval(pollOnce, POLL_INTERVAL_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

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

  useEffect(() => subscribeToCount(setLiveCount), []);

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
