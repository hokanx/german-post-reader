"use client";

import { Calendar, MessageSquare } from "lucide-react";
import { PapkramLogo } from "@/components/papkram-logo";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const SKELETON_LINE_WIDTHS = ["96%", "84%", "91%"];
const SKELETON_LINE_WIDTHS_SHORT = ["78%", "88%"];

/**
 * Before/after comparison: the raw German letter a user actually receives,
 * next to what Papkram turns it into. Sits right after the hero — it's the
 * fastest way to show the product's value before asking for a signup.
 */
export function WhatIsPapkram() {
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const section = copy.whatIsPapkram;

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-24 md:py-26">
      <span className="rounded-full border-2 border-border bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-secondary-foreground">
        {section.eyebrow}
      </span>
      <h2
        className="mt-5 font-heading font-extrabold tracking-[-0.025em] text-foreground"
        style={{ fontSize: "clamp(30px,3.4vw,44px)", lineHeight: 1.04 }}
      >
        {section.heading}
      </h2>

      <div className="mt-9 grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-9">
        {/* Before: the raw German letter — always LTR/German regardless of UI locale, since the real letter never translates. */}
        <div className="flex flex-col gap-3.5">
          <div className="relative -rotate-[1.2deg] rounded-md border-2 border-border bg-card p-5 shadow-[6px_6px_0_0_var(--border)]">
            <div className="flex items-center gap-2.5 border-b-2 border-border pb-2.5">
              <span className="size-[22px] shrink-0 rounded-sm bg-border" aria-hidden="true" />
              <span
                lang="de"
                dir="ltr"
                className="font-heading text-xs font-extrabold uppercase tracking-[0.04em] text-foreground"
              >
                Finanzamt München
              </span>
            </div>
            <div lang="de" dir="ltr" className="mt-3 font-mono text-xs leading-relaxed text-foreground/85">
              Bescheid über Einkommensteuer
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {SKELETON_LINE_WIDTHS.map((width, i) => (
                <span key={i} className="h-[3px] rounded-full bg-foreground/17" style={{ width }} />
              ))}
            </div>
            <div lang="de" dir="ltr" className="mt-3 font-mono text-[11.5px] leading-relaxed text-foreground/60">
              Nachzahlung gem. § 233a AO
              <br />
              Zahlungsaufforderung — 187,42 EUR
              <br />
              Frist: 28.02.2026
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5">
              {SKELETON_LINE_WIDTHS_SHORT.map((width, i) => (
                <span key={i} className="h-[3px] rounded-full bg-foreground/17" style={{ width }} />
              ))}
            </div>
            <span
              className="absolute right-4 bottom-4 size-[52px] rounded-full border-[2.5px] border-destructive bg-destructive/10"
              style={{ transform: "rotate(-14deg)" }}
              aria-hidden="true"
            />
            <span
              className="absolute -top-4 -right-3 rounded-full border-2 border-border bg-accent px-3.5 py-1.5 font-heading text-base font-extrabold text-accent-foreground shadow-[3px_3px_0_0_var(--border)]"
              style={{ transform: "rotate(6deg)" }}
              aria-hidden="true"
            >
              ?
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {section.mailboxLabel}
          </span>
        </div>

        {/* After: Papkram's plain-language output, in the reader's own language. */}
        <div className="flex flex-col gap-3.5">
          <div className="rotate-[1deg] rounded-md border-2 border-border bg-card p-4.5 shadow-[6px_6px_0_0_var(--primary)]">
            <div className="flex items-center gap-2.5">
              <PapkramLogo className="size-[26px]" />
              <span className="text-[13px] font-bold text-foreground">{section.plainLanguageLabel}</span>
            </div>
            <p className="mt-3.5 text-base font-semibold leading-snug text-foreground text-pretty">
              {section.summary}
            </p>
            <div className="mt-3.5 flex items-center gap-2.5 rounded-sm border-2 border-border bg-secondary px-3 py-2.5">
              <Calendar className="size-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[13.5px] font-semibold text-secondary-foreground">{section.deadline}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5 rounded-sm border-2 border-border bg-background px-3 py-2.5">
              <MessageSquare className="size-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[13.5px] font-semibold text-foreground">{section.replyNote}</span>
            </div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {section.readInsteadLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
