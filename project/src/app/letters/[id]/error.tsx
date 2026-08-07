"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function LetterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Letter page error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
      <h1 className="sr-only">Your letter</h1>
      <ErrorState
        message="Couldn't load this letter"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
