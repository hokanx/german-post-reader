"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCw } from "lucide-react";
import type { AppLanguage } from "@/lib/letters/types";
import { translateLetter } from "./actions";

/**
 * Mounted only when letter.language !== the account's current language.
 * Fires the translation automatically (no button — the user already told
 * us their language preference in Settings), then router.refresh()'s the
 * server component once the DB row is updated, which naturally makes this
 * component unmount (languages now match).
 */
export function AutoTranslateBanner({
  letterId,
  targetLanguage,
  bannerText,
  failedText,
  failedRecovery,
}: {
  letterId: string;
  targetLanguage: AppLanguage;
  bannerText: string;
  failedText: string;
  failedRecovery: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"translating" | "failed">("translating");
  const [attempt, setAttempt] = useState(0);
  // React's dev-only Strict Mode mounts/cleans-up/remounts every effect once,
  // to surface effects that aren't safe to run twice. This one calls Gemini
  // and writes to the DB, so it isn't — the mount/remount pair would burn a
  // real API call and quota for nothing. Recording which (letterId,
  // targetLanguage, attempt) key has already been started lets the
  // remount's effect invocation recognize that and skip re-firing, while a
  // genuine new key (a real retry, or a different letter) still fires.
  const startedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${letterId}:${targetLanguage}:${attempt}`;
    if (startedKeyRef.current === key) return;
    startedKeyRef.current = key;

    let cancelled = false;
    translateLetter(letterId, targetLanguage).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setStatus("failed");
        return;
      }
      router.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [letterId, targetLanguage, attempt, router]);

  if (status === "failed") {
    return (
      <button
        type="button"
        onClick={() => {
          setStatus("translating");
          setAttempt((n) => n + 1);
        }}
        className="flex w-full items-center justify-between gap-3 rounded-sm border-2 border-destructive bg-destructive/10 px-4 py-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>
          {failedText} {failedRecovery}
        </span>
        <RotateCw className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm font-bold text-foreground"
    >
      <Loader2 className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
      {bannerText}
    </div>
  );
}
