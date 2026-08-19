"use client";

import posthog from "posthog-js";

type QueuedEvent = { name: string; properties?: Record<string, unknown> };

// Bounded so a session that never grants analytics consent (PostHog never
// loads) can't grow this indefinitely — old events are dropped in favor of
// keeping the most recent ones.
const MAX_QUEUE_SIZE = 50;
let queue: QueuedEvent[] = [];

/**
 * Browser-side event capture. If PostHog hasn't finished loading yet — not
 * configured, not yet initialized, or the user hasn't granted analytics
 * consent — the event is queued instead of silently dropped, and replayed
 * once `flushQueuedEvents()` runs (PosthogProvider calls it right after
 * `posthog.init()` succeeds).
 *
 * This matters beyond the "consent not granted yet" case: PosthogProvider
 * calls `initPosthog()` from its own `useEffect`, and React commits child
 * effects before parent effects. Any component that fires `trackEvent` from
 * a mount-time effect and renders as a descendant of PosthogProvider (which
 * wraps the whole app in the root layout) will otherwise run before
 * PosthogProvider's effect has had a chance to call `posthog.init()`, even
 * when consent was already granted on a prior visit — so queuing is the
 * generically correct fix, not just a consent-gating one.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (posthog.__loaded) {
    posthog.capture(name, properties);
    return;
  }
  queue.push({ name, properties });
  if (queue.length > MAX_QUEUE_SIZE) {
    queue.shift();
  }
}

/** Replays any events queued before PostHog finished loading. Call once, immediately after `posthog.init()`. */
export function flushQueuedEvents() {
  if (!posthog.__loaded || queue.length === 0) return;
  const pending = queue;
  queue = [];
  for (const event of pending) {
    posthog.capture(event.name, event.properties);
  }
}
