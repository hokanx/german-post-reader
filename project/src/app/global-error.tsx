"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            Something broke on our end
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            We&apos;ve been notified. Try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 h-11 rounded-sm border-2 border-border bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
