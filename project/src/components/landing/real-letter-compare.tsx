"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Scale, FileText } from "lucide-react";
import { PapkramLogo } from "@/components/papkram-logo";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const MIN_PERCENT = 8;
const MAX_PERCENT = 92;
const STEP = 4;

function ChevronsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 7l-4 5 4 5M15 7l4 5-4 5" />
    </svg>
  );
}

/**
 * A drag-to-reveal comparison: the real German letter underneath, the
 * plain-language analysis clipped on top. Kept physically LTR (letter on
 * the left, analysis on the right) regardless of UI locale — this is a
 * spatial/interactive construct, not text flow, so it isn't mirrored for
 * RTL the way page layout is. Each panel's own text still carries its own
 * lang/dir: the letter is always lang="de" dir="ltr" (verbatim, never
 * translated, same treatment as a source_quote elsewhere in the app), the
 * analysis panel is lang/dir for the account's own locale. Below 900px the
 * drag interaction is dropped entirely (matches the source design) — both
 * panels render stacked, full height, no clipping or handle.
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
    <section dir={copy.dir} className="border-t-2 border-border bg-card py-24 md:py-26">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-muted-foreground">
            {t.eyebrow}
          </span>
          <h2
            className="mt-5 max-w-[22em] font-heading font-extrabold tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(34px,4vw,52px)", lineHeight: 1.02 }}
          >
            {t.heading}
          </h2>
          <p className="mt-4 max-w-[44em] text-[17px] leading-relaxed text-foreground/72 [text-wrap:pretty]">{t.body}</p>
        </motion.div>

        <div
          dir="ltr"
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative mt-11 h-[620px] touch-none overflow-hidden rounded-md border-2 border-border bg-card shadow-[8px_8px_0_0_var(--border)] select-none max-[900px]:h-auto max-[900px]:touch-auto"
        >
          {/* Bottom layer: the real German letter — always full width */}
          <div
            dir="ltr"
            className="absolute inset-0 overflow-y-auto bg-card p-10 max-[900px]:relative max-[900px]:overflow-visible"
          >
            <div className="flex items-center justify-between gap-4 border-b-[1.5px] border-foreground/20 pb-3.5">
              <span className="font-mono text-xs font-medium tracking-[0.04em] text-foreground" lang="de" dir="ltr">
                {t.letterSender}
              </span>
              <span className="text-[10px] font-bold tracking-[0.08em] text-foreground/50 uppercase">{t.letterLabel}</span>
            </div>
            <div className="mt-6 font-mono text-[12.5px] leading-[1.85] text-foreground/90" lang="de" dir="ltr">
              <p className="text-foreground/55">{t.letterRecipient}</p>
              <p className="mt-4 font-medium">{t.letterSubject}</p>
              <p className="mt-4">{t.letterGreeting}</p>
              <p className="mt-3">{t.letterBody1}</p>
              <p className="mt-3">{t.letterBody2}</p>
              <p className="mt-3">{t.letterBody3}</p>
              <p className="mt-4">
                {t.letterClosing}
                <br />
                {t.letterSignature}
              </p>
            </div>
          </div>

          {/* Top layer: the plain-language analysis — clipped to reveal from the handle rightward. The
              `dark` wrapper reuses the app's own dark-mode token palette (ink bg, cream text) rather than
              hardcoding those colors, since that's exactly the fixed contrast this panel is going for. */}
          <div
            dir={analysisIsRtl ? "rtl" : "ltr"}
            lang={locale}
            className="dark absolute inset-0 overflow-y-auto bg-background p-10 text-foreground max-[900px]:relative max-[900px]:mt-6 max-[900px]:overflow-visible max-[900px]:[clip-path:none!important]"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            <div className="flex items-center justify-between gap-4 border-b-[1.5px] border-foreground/25 pb-3.5">
              <div className="flex items-center gap-2.5">
                <PapkramLogo className="size-5" />
                <span className="font-heading text-sm font-extrabold tracking-[-0.01em]">Papkram</span>
              </div>
              <span className="rounded-full border-2 border-foreground px-3 py-1 text-[10px] font-bold tracking-[0.07em] text-accent uppercase">
                {t.analysisChip}
              </span>
            </div>

            <h3
              className="mt-8 font-heading font-extrabold tracking-[-0.025em]"
              style={{ fontSize: "clamp(26px,2.6vw,36px)", lineHeight: 1.08 }}
            >
              {t.analysisHeading}
            </h3>
            <p className="mt-4 max-w-[40em] text-[16.5px] leading-relaxed text-foreground/85 [text-wrap:pretty]">{t.analysisBody}</p>

            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-3.5">
              <div className="rounded-sm border-2 border-accent bg-accent/10 p-4.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] text-accent uppercase">
                  <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {t.deadlineLabel}
                </p>
                <p className="mt-1.5 text-[15.5px] leading-tight font-semibold">{t.deadlineBody}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/70">{t.deadlineNote}</p>
              </div>
              <div className="rounded-sm border-2 border-foreground/35 p-4.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] text-primary uppercase">
                  <Scale className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {t.rightLabel}
                </p>
                <p className="mt-1.5 text-[15.5px] leading-tight font-semibold">{t.rightBody}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3.5 rounded-sm border-2 border-foreground/35 bg-foreground/[0.06] p-4.5">
              <FileText className="size-[18px] shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-bold">{t.replyDraftedHeading}</p>
                <p className="mt-0.5 text-[13px] text-foreground/70">{t.replyDraftedBody}</p>
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
            className="absolute top-0 bottom-0 z-10 flex w-0 -translate-x-1/2 cursor-ew-resize items-center justify-center focus-visible:outline-none max-[900px]:hidden"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-0 bottom-0 w-[2px] bg-accent" aria-hidden="true" />
            <div className="relative flex size-[46px] shrink-0 items-center justify-center rounded-full border-2 border-border bg-accent text-accent-foreground shadow-[3px_3px_0_0_var(--border)] focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronsIcon className="size-5" />
            </div>
          </div>
        </div>
        <div className="mt-4.5 flex items-center justify-center gap-2.5 max-[900px]:hidden">
          <ChevronsIcon className="size-[15px] text-foreground/50" />
          <span className="text-[13px] text-foreground/55">{t.dragHint}</span>
        </div>
      </div>
    </section>
  );
}
