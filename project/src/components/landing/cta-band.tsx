"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { StampBadge } from "./stamp-badge";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function CtaBand() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <motion.section
      dir={copy.dir}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-primary py-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <StampBadge
          label={copy.cta.badge}
          className="w-24 rotate-[3deg] opacity-95"
          dir={copy.dir}
        />
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-primary-foreground md:text-4xl">
          {copy.cta.heading}
        </h2>
        <Link
          href="/signup"
          className={buttonVariants({
            variant: "secondary",
            className: "h-12 rounded-sm px-6 text-base font-bold",
          })}
        >
          {copy.cta.button}
        </Link>
      </div>
    </motion.section>
  );
}
