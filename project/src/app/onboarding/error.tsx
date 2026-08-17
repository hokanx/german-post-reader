"use client";

import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { ErrorState } from "@/components/error-state";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Onboarding page error", error);
  }, [error]);

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center bg-background px-6 py-16">
        <h1 className="sr-only">Choose your language</h1>
        <ErrorState
          message="Couldn't load the language picker"
          recovery="This is usually temporary. Try again in a moment."
          onRetry={reset}
        />
      </main>
    </>
  );
}
