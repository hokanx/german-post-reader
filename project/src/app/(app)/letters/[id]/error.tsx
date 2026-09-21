"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorState } from "@/components/error-state";
import { APP_COPY } from "@/lib/i18n/copy";
import { useDocumentLanguage } from "@/lib/i18n/use-document-language";
import { textDirection } from "@/lib/letters/locale";

export default function LetterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const language = useDocumentLanguage();
  const copy = APP_COPY[language].letters;

  useEffect(() => {
    console.error("Letter page error", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <main
      dir={textDirection(language)}
      className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16"
    >
      <h1 className="sr-only">{copy.errorTitle}</h1>
      <ErrorState message={copy.errorTitle} recovery={copy.errorRecovery} onRetry={reset} />
    </main>
  );
}
