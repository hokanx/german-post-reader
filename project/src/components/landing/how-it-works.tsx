"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Upload, Sparkles, Send, Copy, CalendarClock } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const STEP_ICONS = [Upload, Sparkles, Send];

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.howItWorks.heading}
      </h2>
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {copy.howItWorks.steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <motion.div
              key={step.title}
              variants={
                shouldReduceMotion
                  ? undefined
                  : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
              }
              className="relative rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]"
            >
              <span className="absolute -top-4 -left-2 rounded-full border-2 border-border bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-border bg-accent">
                <Icon className="size-5 text-accent-foreground" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">{step.description}</p>

              <div className="mt-4 flex items-center gap-2 rounded-sm border-2 border-border bg-muted px-3 py-2">
                {i === 0 && <Upload className="size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />}
                {i === 1 && <CalendarClock className="size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />}
                {i === 2 && <Copy className="size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />}
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">{step.mockup.label}</p>
                  <p className="truncate text-xs text-foreground/60">{step.mockup.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
