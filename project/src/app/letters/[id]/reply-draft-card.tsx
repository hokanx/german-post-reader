"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { CopyReplyButton } from "./copy-reply-button";

export function ReplyDraftCard({
  replyDraft,
  translation,
  translationLanguageLabel,
  translationDir,
}: {
  replyDraft: string;
  translation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
}) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
          Your reply, in German
        </h2>
        <CopyReplyButton text={replyDraft} />
      </div>
      <p className="mt-1 text-sm text-foreground/60">Ready to send as-is — the recipient reads German.</p>
      <p dir="ltr" className="mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground">
        {replyDraft}
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
          ? `Hide ${translationLanguageLabel} translation`
          : `Show what this says in ${translationLanguageLabel}`}
      </button>

      {showTranslation && (
        <div
          id="reply-translation"
          dir={translationDir}
          className="mt-3 whitespace-pre-wrap rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          {translation}
        </div>
      )}
    </section>
  );
}
