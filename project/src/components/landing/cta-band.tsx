"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_MODE } from "@/lib/constants";
import { StampBadge } from "./stamp-badge";
import { LiveCounter } from "./live-counter";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function CtaBand({ registeredCount }: { registeredCount: number | null }) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <motion.section
      dir={copy.dir}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-t-2 border-border bg-primary py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7.5 px-6 text-center">
        <StampBadge
          label={copy.cta.badge}
          className="w-[150px] rotate-[3deg]"
          dir={copy.dir}
        />
        {DEMO_MODE && <LiveCounter registeredCount={registeredCount} label={copy.hero.counterLabel} tone="dark" />}
        <h2
          className="max-w-[20em] font-heading font-extrabold tracking-[-0.03em] text-primary-foreground [text-wrap:balance]"
          style={{ fontSize: "clamp(34px,4.6vw,60px)", lineHeight: 1.02 }}
        >
          {copy.cta.heading}
        </h2>
        <Link
          href="/signup"
          className={buttonVariants({
            variant: "secondary",
            className: "h-[54px] rounded-sm px-6 text-base font-bold",
          })}
        >
          {copy.cta.button}
        </Link>
      </div>
    </motion.section>
  );
}
