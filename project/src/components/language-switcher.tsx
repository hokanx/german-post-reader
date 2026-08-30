"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics/track-event";
import { changeLanguage } from "@/lib/profile/actions";
import { LANGUAGE_NAMES, type AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "tr", label: "TR" },
  { code: "de", label: "DE" },
  { code: "uk", label: "UK" },
];

export function LanguageSwitcher({ current }: { current: AppLanguage }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const copy = APP_COPY[current].languageSwitcher;
  const currentLabel = LANGUAGES.find((lang) => lang.code === current)?.label ?? current.toUpperCase();

  function handleSelect(next: AppLanguage) {
    setOpen(false);
    if (next === current) return;
    startTransition(async () => {
      const result = await changeLanguage(next, current);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      trackEvent("language_changed", { from: current, to: next });
      toast.success(APP_COPY[next].languageSwitcher.updatedToast);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={pending}
        aria-label={copy.ariaLabel}
        className="flex h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 text-xs font-bold uppercase tracking-[0.04em] text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <Globe className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {currentLabel}
        <ChevronDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1.5">
        <div role="radiogroup" aria-label={copy.ariaLabel} className="flex flex-col gap-0.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={current === lang.code}
              disabled={pending}
              onClick={() => handleSelect(lang.code)}
              className={`flex h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
                current === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="w-6 shrink-0 text-xs font-bold uppercase tracking-[0.04em]">{lang.label}</span>
              <span>{LANGUAGE_NAMES[lang.code]}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
