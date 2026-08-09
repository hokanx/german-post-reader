"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function ValueStack() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const rows = [...copy.offer.items, ...copy.offer.bonuses];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.offer.heading}
      </h2>
      <div className="mx-auto mt-10 max-w-xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.offer.trialBadge(FREE_LETTER_LIMIT)}
          </span>

          <ul className="mt-6 grid gap-4">
            {rows.map((row) => (
              <li
                key={row.name}
                className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{row.name}</p>
                    <p className="text-sm text-foreground/70">{row.description}</p>
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap text-sm text-foreground/60">{row.comparisonCost}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t-2 border-border pt-4">
            <span className="text-sm font-bold text-foreground">{copy.offer.totalComparisonLabel}</span>
            <span className="text-sm font-bold text-foreground/60 line-through">
              {copy.offer.totalComparisonValue}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-foreground">{copy.offer.priceLabel}</span>
            <span className="whitespace-nowrap text-4xl font-extrabold tracking-[-0.02em] text-foreground">
              {formatEur(SUBSCRIPTION_PRICE_EUR)}
              <span className="ml-1 text-sm font-normal text-foreground/60">{copy.offer.perYearLabel}</span>
            </span>
          </div>

          <Link
            href="/signup"
            className={buttonVariants({ className: "mt-8 h-12 w-full rounded-sm text-base font-bold" })}
          >
            {copy.offer.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
