import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Built from actual first-party dependencies (Supabase, PostHog, Sentry) —
// see CLAUDE.md's env-var list for what each of these is. The Supabase URL
// is already public (shipped as NEXT_PUBLIC_SUPABASE_ANON_KEY's companion),
// so reading it into the CSP at build time isn't exposing anything new.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

const CSP = [
  "default-src 'self'",
  // Next.js App Router streams RSC payloads to the client via inline
  // `self.__next_f.push(...)` script tags — required for hydration, and
  // emitted with no nonce/hash in this Next.js version. Blocking them
  // outright breaks every page (verified: without 'unsafe-inline' the app
  // fails to hydrate at all). Real protection against injected <script>
  // still comes from output escaping (React's default) plus every other
  // directive here; closing this specific gap needs per-request nonce
  // middleware, which is a separate, larger change if wanted later.
  "script-src 'self' 'unsafe-inline'",
  // framer-motion and Tailwind's arbitrary-value utilities set inline
  // style attributes at runtime — style-src-attr has no browser-wide
  // nonce mechanism for that, so 'unsafe-inline' here is a deliberate,
  // narrow trade-off (styles can't execute script, unlike script-src).
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseUrl} ${posthogHost} https://*.posthog.com https://*.sentry.io`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim();

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      // Next.js defaults Server Actions to a 1MB body limit, which silently
      // rejected real phone-camera photos (3-15MB) with an uncaught 413 (see
      // docs/superpowers/specs/pipeline.md for the incident this was found
      // from). Raised to 4mb — just under Vercel's own hard 4.5MB serverless
      // function body ceiling (docs.vercel.com/docs/errors/function_payload_too_large),
      // which no Next.js config can override. The real fix for large photos
      // is client-side compression (src/lib/image-compression.ts) before
      // upload; this just matches the config to the platform's actual limit
      // instead of implying more headroom than exists.
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: false,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
