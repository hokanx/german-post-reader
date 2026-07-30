"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Upload, Sparkles, Send } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Upload",
    description: "Snap a photo or drop in a PDF of the letter you received.",
  },
  {
    icon: Sparkles,
    title: "We read it",
    description: "We translate it, summarize it, and flag every deadline — in your language.",
  },
  {
    icon: Send,
    title: "You reply",
    description: "Copy the ready-to-send reply draft, or write your own from the summary.",
  },
];

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        Three steps. That&apos;s it.
      </h2>
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
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
              <step.icon className="size-5 text-accent-foreground" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/70">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
