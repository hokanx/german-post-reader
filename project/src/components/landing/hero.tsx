"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Lock, ShieldCheck, Server } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import { StampBadge } from "./stamp-badge";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const mockup = copy.hero.mockup;

  const fadeRise = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
      };

  return (
    <section
      dir={copy.dir}
      className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 md:grid-cols-2 md:items-center md:pt-24 md:pb-28"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeRise} className="relative mb-6 w-fit">
          <StampBadge
            label={copy.hero.stampBadge(FREE_LETTER_LIMIT)}
            className="rotate-[-4deg]"
            dir={copy.dir}
          />
        </motion.div>
        <motion.h1
          variants={fadeRise}
          className="text-5xl font-extrabold tracking-[-0.02em] text-foreground md:text-7xl"
        >
          {copy.hero.headlineLine1}
          <br />
          {copy.hero.headlineLine2}
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-6 max-w-md text-lg text-foreground/80">
          {copy.hero.subhead}
        </motion.p>
        <motion.div variants={fadeRise} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className={buttonVariants({ className: "h-12 rounded-sm px-6 text-base font-bold" })}
          >
            {copy.hero.ctaPrimary}
          </Link>
          <span className="text-sm text-foreground/60">{copy.hero.ctaNote}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
        dir={mockup.dir}
        className="mx-auto w-[88%] max-w-sm rounded-md border-2 border-border bg-card p-6 shadow-[8px_8px_0_0_var(--border)] sm:w-full"
      >
        <span className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {mockup.chip}
        </span>
        <p className="mt-4 text-base font-medium leading-snug text-foreground">
          {mockup.summary}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-sm border-2 border-border bg-muted px-3 py-2">
          <CalendarClock className="size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-sm text-foreground">{mockup.deadline}</span>
        </div>
        <div className="mt-4 rounded-sm border-2 border-border bg-background px-3 py-2 text-sm text-foreground/80">
          {mockup.reply}
        </div>
      </motion.div>

      <motion.ul
        dir={copy.dir}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.4 }}
        className="col-span-full mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start"
      >
        {[Lock, ShieldCheck, Server].map((Icon, i) => (
          <li key={copy.hero.trustBadges[i]} className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {copy.hero.trustBadges[i]}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
