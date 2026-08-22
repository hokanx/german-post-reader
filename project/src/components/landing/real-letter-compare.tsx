"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Scale, MoveHorizontal, FileText } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const MIN_PERCENT = 8;
const MAX_PERCENT = 92;
const STEP = 4;

/**
 * A drag-to-reveal comparison: the real German letter underneath, the
 * plain-language analysis clipped on top. Kept physically LTR (letter on
 * the left, analysis on the right) regardless of UI locale — this is a
 * spatial/interactive construct, not text flow, so it isn't mirrored for
 * RTL the way page layout is. Each panel's own text still carries its own
 * lang/dir: the letter is always lang="de" dir="ltr" (verbatim, never
 * translated, same treatment as a source_quote elsewhere in the app), the
 * analysis panel is lang/dir for the account's own locale.
 */
export function RealLetterCompare() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.realLetter;
  const analysisIsRtl = locale === "ar";

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(46);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, pct)));
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp(e: React.PointerEvent) {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      setPosition((p) => Math.max(MIN_PERCENT, p - STEP));
    } else if (e.key === "ArrowRight") {
      setPosition((p) => Math.min(MAX_PERCENT, p + STEP));
    } else {
      return;
    }
    e.preventDefault();
  }

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {t.eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
          {t.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-foreground/70">{t.body}</p>
      </motion.div>

      <div
        dir="ltr"
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative mt-10 h-[560px] touch-none overflow-hidden rounded-md border-2 border-border bg-card shadow-[6px_6px_0_0_var(--border)] select-none sm:h-[460px]"
      >
        {/* Bottom layer: the real German letter — always full width */}
        <div dir="ltr" className="absolute inset-0 overflow-y-auto bg-card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">{t.letterLabel}</p>
          <p className="mt-1 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground" lang="de" dir="ltr">
            {t.letterSender}
          </p>
          <div className="mt-4 border-t-2 border-border pt-4" lang="de" dir="ltr">
            <p className="font-mono text-xs text-foreground/70">{t.letterRecipient}</p>
            <p className="mt-4 font-mono text-sm font-bold text-foreground">{t.letterSubject}</p>
            <p className="mt-4 font-mono text-sm text-foreground">{t.letterGreeting}</p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-foreground/80">{t.letterBody1}</p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-foreground/80">{t.letterBody2}</p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-foreground/80">{t.letterBody3}</p>
            <p className="mt-4 font-mono text-sm text-foreground">{t.letterClosing}</p>
            <p className="font-mono text-sm text-foreground">{t.letterSignature}</p>
          </div>
        </div>

        {/* Top layer: the plain-language analysis — clipped to reveal from the handle rightward */}
        <div
          dir={analysisIsRtl ? "rtl" : "ltr"}
          lang={locale}
          className="absolute inset-0 overflow-y-auto bg-foreground p-6 text-background sm:p-8"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <span className="rounded-full border-2 border-background/40 bg-transparent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-background">
            {t.analysisChip}
          </span>
          <h3 className="mt-4 font-heading text-2xl font-extrabold tracking-[-0.02em] text-background">
            {t.analysisHeading}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-background/80">{t.analysisBody}</p>

          <div className="mt-5 rounded-sm border-2 border-background/40 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-background/70">
              <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.deadlineLabel}
            </p>
            <p className="mt-1.5 text-sm font-bold text-background">{t.deadlineBody}</p>
            <p className="mt-1 text-xs text-background/70">{t.deadlineNote}</p>
          </div>

          <div className="mt-3 rounded-sm border-2 border-background/40 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-background/70">
              <Scale className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.rightLabel}
            </p>
            <p className="mt-1.5 text-sm font-bold text-background">{t.rightBody}</p>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t-2 border-background/40 pt-4">
            <FileText className="size-4 shrink-0 text-background/70" strokeWidth={1.5} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-background">{t.replyDraftedHeading}</p>
              <p className="text-xs text-background/70">{t.replyDraftedBody}</p>
            </div>
          </div>
        </div>

        {/* Drag handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={t.dragHint}
          aria-valuemin={MIN_PERCENT}
          aria-valuemax={MAX_PERCENT}
          aria-valuenow={Math.round(position)}
          aria-orientation="horizontal"
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          className="absolute top-0 bottom-0 z-10 flex w-0 -translate-x-1/2 cursor-ew-resize items-center justify-center focus-visible:outline-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 w-[3px] bg-accent" aria-hidden="true" />
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-accent text-accent-foreground shadow-[3px_3px_0_0_var(--border)] focus-visible:ring-2 focus-visible:ring-ring">
            <MoveHorizontal className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {t.dragHint}
      </p>
    </section>
  );
}
