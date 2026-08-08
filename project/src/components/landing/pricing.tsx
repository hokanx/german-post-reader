"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function Pricing() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.pricing.heading}
      </h2>
      <div className="mx-auto mt-10 max-w-md">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.pricing.badge(FREE_LETTER_LIMIT)}
          </span>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
            <span className="whitespace-nowrap text-5xl font-extrabold tracking-[-0.02em] text-foreground">
              {formatEur(SUBSCRIPTION_PRICE_EUR)}
            </span>
            <span className="text-foreground/60">{copy.pricing.priceSuffix(FREE_LETTER_LIMIT)}</span>
          </div>
          <ul className="mt-6 grid gap-3">
            {copy.pricing.features.map((feature) => (
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
            {copy.pricing.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
