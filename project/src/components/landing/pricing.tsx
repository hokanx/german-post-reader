"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";

const FEATURES = [
  "Unlimited letter analyses",
  "Cancel any time",
  "Summaries, deadlines, and reply drafts",
  "English, Arabic, and Turkish",
  "Full letter history",
];

export function Pricing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        One plan. Everything included.
      </h2>
      <div className="mx-auto mt-10 max-w-md">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {FREE_LETTER_LIMIT} free letters, no card
          </span>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold tracking-[-0.02em] text-foreground">
              €{SUBSCRIPTION_PRICE_EUR}
            </span>
            <span className="text-foreground/60">/ year, after your {FREE_LETTER_LIMIT} free letters</span>
          </div>
          <ul className="mt-6 grid gap-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className={buttonVariants({ className: "mt-8 h-12 w-full rounded-sm text-base font-bold" })}
          >
            Start free trial
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
