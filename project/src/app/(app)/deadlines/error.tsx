"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function DeadlinesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Deadlines page error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl flex-1 bg-background px-6 py-16">
      <h1 className="sr-only">Deadlines</h1>
      <ErrorState
        message="Couldn't load your deadlines"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
