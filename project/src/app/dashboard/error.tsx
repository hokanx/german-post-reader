"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl flex-1 bg-background px-6 py-16">
      <ErrorState
        message="Couldn't load your dashboard"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
