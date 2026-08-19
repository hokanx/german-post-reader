"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { buildShareSummary } from "@/lib/letters/build-share-summary";
import { formatDate } from "@/lib/format-date";
import { APP_COPY } from "@/lib/i18n/copy";
import type { AppLanguage } from "@/lib/letters/types";
import { getOriginalLetterUrl } from "./actions";

type LetterMenuLetter = {
  senderName: string | null;
  /** ISO 8601 or null — the date the letter itself is dated/issued, not when it was uploaded. See letter_date on the letters table. */
  letterDate: string | null;
  summary: string;
  payments: { description: string; amount: string }[];
  appointments: { description: string; date: string }[];
  deadlines: { date: string; description: string }[];
  keyFacts: { label: string; value: string }[];
};

const menuItemClasses =
  "flex h-11 w-full items-center gap-2.5 rounded-sm px-3 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LetterMenu({
  letterId,
  letter,
  language,
}: {
  letterId: string;
  letter: LetterMenuLetter;
  language: AppLanguage;
}) {
  const copy = APP_COPY[language].letters;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const dir = language === "ar" ? "rtl" : "ltr";

  function handleViewOriginal() {
    startTransition(async () => {
      const result = await getOriginalLetterUrl(letterId, language);
      setOpen(false);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      window.open(result.data.url, "_blank", "noopener,noreferrer");
    });
  }

  async function handleShareSummary() {
    setOpen(false);

    // Explains the letter the way a person would — who it's from and when
    // it was dated — rather than opening straight into the raw summary.
    const openingLine = letter.senderName
      ? letter.letterDate
        ? copy.letterExplainerWithDate(letter.senderName, formatDate(letter.letterDate, language))
        : copy.letterExplainerWithoutDate(letter.senderName)
      : "";

    const text = buildShareSummary(
      {
        openingLine,
        summary: letter.summary,
        payments: letter.payments,
        appointments: letter.appointments,
        deadlines: letter.deadlines,
        keyFacts: letter.keyFacts,
      },
      copy,
    );

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text });
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          toast.error(copy.copyFailedToast);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(copy.summaryCopiedToast);
    } catch {
      toast.error(copy.copyFailedToast);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={copy.moreOptions}
        disabled={pending}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <MoreHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent dir={dir} align="end" className="w-64 p-1.5">
        <button type="button" onClick={handleViewOriginal} disabled={pending} className={menuItemClasses}>
          <ExternalLink className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          {copy.viewOriginalLetter}
        </button>
        <button type="button" onClick={handleShareSummary} className={menuItemClasses}>
          <Share2 className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          {copy.shareSummary}
        </button>
      </PopoverContent>
    </Popover>
  );
}
