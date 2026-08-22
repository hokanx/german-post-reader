"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck, Server, ShieldAlert } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const ICONS = [Lock, ShieldCheck, Server, ShieldAlert];

export function PrivacySection() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.privacy;

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {t.eyebrow}
      </span>
      <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {t.heading}
      </h2>
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid gap-4 md:grid-cols-2"
      >
        {t.cards.map((card, index) => {
          const Icon = ICONS[index] ?? ShieldAlert;
          return (
            <motion.div
              key={card.heading}
              variants={
                shouldReduceMotion ? undefined : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
              }
              className="flex items-start gap-4 rounded-md border-2 border-border bg-muted p-6"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
                <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                  {card.heading}
                </h3>
                <p className="mt-1 text-sm text-foreground/70">{card.body}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
