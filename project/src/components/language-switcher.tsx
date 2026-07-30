"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics/track-event";
import { changeLanguage } from "@/lib/profile/actions";
import type { AppLanguage } from "@/lib/letters/types";

const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "tr", label: "TR" },
];

export function LanguageSwitcher({ current }: { current: AppLanguage }) {
  const [pending, startTransition] = useTransition();

  function handleSelect(next: AppLanguage) {
    if (next === current) return;
    startTransition(async () => {
      const result = await changeLanguage(next);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      trackEvent("language_changed", { from: current, to: next });
      toast.success("Language updated");
    });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border-2 border-border bg-card p-1"
      role="group"
      aria-label="Analysis language"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          disabled={pending}
          onClick={() => handleSelect(lang.code)}
          aria-pressed={current === lang.code}
          className={`flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-bold uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
            current === lang.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
