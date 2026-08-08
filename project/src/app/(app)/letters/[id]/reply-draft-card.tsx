"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { REPLY_TONE_LABELS, type AppLanguage, type ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { CopyReplyButton } from "./copy-reply-button";
import { regenerateReply } from "./actions";

const TONES = Object.keys(REPLY_TONE_LABELS.en) as ReplyTone[];

export function ReplyDraftCard({
  letterId,
  language,
  initialReplyDraft,
  initialTranslation,
  translationLanguageLabel,
  translationDir,
}: {
  letterId: string;
  language: AppLanguage;
  initialReplyDraft: string;
  initialTranslation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
}) {
  const copy = APP_COPY[language].letters;
  const toneLabels = REPLY_TONE_LABELS[language];
  const [replyDraft, setReplyDraft] = useState(initialReplyDraft);
  const [translation, setTranslation] = useState(initialTranslation);
  const [tone, setTone] = useState<ReplyTone | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleToneSelect(nextTone: ReplyTone) {
    if (pending) return;
    startTransition(async () => {
      const result = await regenerateReply(letterId, nextTone);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      setReplyDraft(result.data.reply_draft);
      setTranslation(result.data.reply_draft_translation);
      setTone(nextTone);
      toast.success(copy.replyRedraftedToast);
    });
  }

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
          {copy.yourReplyInGerman}
        </h2>
        <CopyReplyButton text={replyDraft} copy={copy} />
      </div>
      <p className="mt-1 text-sm text-foreground/60">{copy.readyToSend}</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.replyToneGroupLabel}>
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            disabled={pending}
            onClick={() => handleToneSelect(t)}
            aria-pressed={tone === t}
            className={`flex h-9 items-center rounded-full border-2 px-3 text-xs font-bold uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
              tone === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {toneLabels[t]}
          </button>
        ))}
      </div>

      <p
        dir="ltr"
        aria-busy={pending}
        className={`mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground transition-opacity ${pending ? "opacity-50" : ""}`}
      >
        {pending ? copy.redrafting : replyDraft}
      </p>

      <button
        type="button"
        onClick={() => setShowTranslation((v) => !v)}
        aria-expanded={showTranslation}
        aria-controls="reply-translation"
        className="mt-5 flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Languages className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {showTranslation
          ? copy.hideTranslation(translationLanguageLabel)
          : copy.showTranslation(translationLanguageLabel)}
      </button>

      {showTranslation && (
        <div
          id="reply-translation"
          dir={translationDir}
          className="mt-3 whitespace-pre-wrap rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          {pending ? "…" : translation}
        </div>
      )}
    </section>
  );
}
