"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

/** A small circular CTA that stays pinned to the bottom-right corner while scrolling, regardless of text direction — a fixed screen anchor, not part of text flow. */
export function FloatingCta() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="fixed right-5 bottom-5 z-40"
    >
      <Link
        href="/signup"
        aria-label={copy.hero.ctaPrimary}
        title={copy.hero.ctaPrimary}
        className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-[4px_4px_0_0_var(--border)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0"
      >
        <ArrowUpRight className="size-6" strokeWidth={2} aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
