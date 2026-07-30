import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      // Real phone-camera photos routinely run 3-15MB. Next.js defaults
      // Server Actions to a 1MB body limit, which silently rejected those
      // uploads with an uncaught 413 (see docs/superpowers/specs/pipeline.md
      // for the incident this was found from). 20MB covers realistic photo
      // sizes with headroom, while staying under Gemini's ~20MB practical
      // ceiling for inline (base64) image data.
      bodySizeLimit: "20mb",
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
