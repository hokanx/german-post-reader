import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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
