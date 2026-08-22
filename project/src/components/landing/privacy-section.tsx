"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck, Server } from "lucide-react";
import { FREE_LETTER_LIMIT, DEMO_MODE } from "@/lib/constants";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const ICONS = [Lock, ShieldCheck, Server];

export function PrivacySection() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.privacy;

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-24 md:py-26">
      <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-accent-foreground">
        {t.eyebrow}
      </span>
      <h2
        className="mt-5 max-w-[20em] font-heading font-extrabold tracking-[-0.025em] text-foreground"
        style={{ fontSize: "clamp(34px,4vw,52px)", lineHeight: 1.02 }}
      >
        {t.heading}
      </h2>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-13 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6.5"
      >
        {t.cards.map((card, index) => {
          const Icon = ICONS[index] ?? Lock;
          return (
            <motion.div
              key={card.heading}
              variants={
                shouldReduceMotion ? undefined : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
              }
              className="rounded-sm border-2 border-border bg-card p-6"
            >
              <Icon className="size-5 text-primary" strokeWidth={1.8} aria-hidden="true" />
              <h3 className="mt-3.5 font-heading text-[21px] font-extrabold tracking-[-0.02em] text-foreground">
                {card.heading}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-foreground/72 [text-wrap:pretty]">{card.body}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-6.5 rounded-sm border-2 border-border bg-muted p-7">
        <h3 className="font-heading text-[23px] font-extrabold tracking-[-0.02em] text-foreground">
          {t.sureHeading}
        </h3>
        <p className="mt-2.5 max-w-[52em] text-[15.5px] leading-relaxed text-foreground/78 [text-wrap:pretty]">
          {t.sureBody}
        </p>
      </div>

      {DEMO_MODE && (
        <div className="mt-6.5 flex flex-wrap items-center gap-x-5 gap-y-4 border-t-2 border-border pt-6.5">
          <span className="rounded-full border-2 border-border bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground uppercase tracking-[0.07em]">
            {t.priceChip(FREE_LETTER_LIMIT)}
          </span>
          <span className="text-[15.5px] text-foreground/72">{t.priceLine}</span>
        </div>
      )}
    </section>
  );
}
