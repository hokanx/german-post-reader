"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function Bonuses() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.bonuses.heading}
      </h2>
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {copy.bonuses.items.map((item) => (
          <motion.div
            key={item.name}
            variants={
              shouldReduceMotion
                ? undefined
                : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
            }
            className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]"
          >
            {item.badge && (
              <span className="mb-3 inline-block rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                {item.badge}
              </span>
            )}
            <h3 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
