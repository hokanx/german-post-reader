"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function WelcomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Welcome page error", error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center bg-background px-6 py-16">
      <h1 className="sr-only">You&apos;re in</h1>
      <ErrorState
        message="Couldn't load this page"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
