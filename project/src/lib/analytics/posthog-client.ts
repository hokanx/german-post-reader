"use client";

type PosthogInstance = (typeof import("posthog-js"))["default"];

/**
 * Owns the lazily-imported posthog-js instance.
 *
 * posthog-js is 62.5 KB brotli. It was statically imported by both
 * PosthogProvider (which wraps the whole tree in the root layout) and
 * track-event.ts, so it landed in the initial bundle of EVERY route — it
 * downloaded, parsed and executed on /privacy, /terms, /login and /signup,
 * and for every visitor who was about to press "deny" in the cookie banner.
 *
 * Importing it only inside the consent branch is safe because trackEvent
 * already queues events fired before PostHog is ready (see track-event.ts);
 * the dynamic import simply widens a window that code already handles.
 *
 * The in-flight promise is cached so concurrent callers share one network
 * request rather than racing two.
 */
let instance: PosthogInstance | null = null;
let loading: Promise<PosthogInstance> | null = null;

/** The instance if it has finished loading, else null. Never triggers a load. */
export function getPosthog(): PosthogInstance | null {
  return instance;
}

/** Loads posthog-js on first call; subsequent calls reuse the same module. */
export function loadPosthog(): Promise<PosthogInstance> {
  if (instance) return Promise.resolve(instance);
  loading ??= import("posthog-js").then((mod) => {
    instance = mod.default;
    return mod.default;
  });
  return loading;
}
