"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { PapkramLogo } from "@/components/papkram-logo";
import { DEMO_MODE, FREE_LETTER_LIMIT } from "@/lib/constants";
import { StampBadge } from "./stamp-badge";
import { LiveCounter } from "./live-counter";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ registeredCount }: { registeredCount: number | null }) {
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
      className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-20 md:grid-cols-2 md:items-center md:pt-24 md:pb-22"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeRise} className="mb-7 flex items-center gap-3.5">
          <PapkramLogo className="size-[52px]" />
          <span className="font-heading text-[34px] leading-none font-extrabold tracking-[-0.03em] text-foreground">
            Papkram
          </span>
        </motion.div>
        <motion.div variants={fadeRise} className="relative mb-8 w-fit">
          <StampBadge
            label={copy.hero.stampBadge(FREE_LETTER_LIMIT)}
            className="rotate-[-4deg]"
            dir={copy.dir}
          />
        </motion.div>
        <motion.h1
          variants={fadeRise}
          className="font-heading font-extrabold tracking-[-0.03em] text-foreground [text-wrap:balance]"
          style={{ fontSize: "clamp(46px,6.2vw,84px)", lineHeight: 0.95 }}
        >
          <span className="block">{copy.hero.headlineLine1}</span>
          <span className="block text-primary">{copy.hero.headlineLine2}</span>
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-7 max-w-[33em] text-lg leading-relaxed text-foreground/78 [text-wrap:pretty]">
          {copy.hero.subhead}
        </motion.p>
        <motion.div variants={fadeRise} className="mt-9 flex flex-wrap items-center gap-[18px]">
          <Link
            href="/signup"
            className={buttonVariants({ className: "h-[54px] rounded-sm px-6 text-base font-bold" })}
          >
            {copy.hero.ctaPrimary}
          </Link>
          <span className="text-sm text-foreground/60">{copy.hero.ctaNote}</span>
        </motion.div>
        {DEMO_MODE && (
          <motion.div variants={fadeRise} className="mt-7">
            <LiveCounter registeredCount={registeredCount} label={copy.hero.counterLabel} />
            <p className="mt-4 max-w-[34em] text-sm leading-relaxed text-foreground/60 [text-wrap:pretty]">
              {copy.hero.demoStatus}
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
        dir={mockup.dir}
        className="mx-auto w-[88%] max-w-sm rounded-sm border-2 border-border bg-card p-6 shadow-[8px_8px_0_0_var(--border)] sm:w-full"
      >
        <span className="rounded-full border-2 border-border bg-muted px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {mockup.chip}
        </span>
        <p className="mt-5 text-lg leading-snug font-medium text-foreground [text-wrap:pretty]">
          {mockup.summary}
        </p>
        <div className="mt-5 rounded-sm border-2 border-border bg-muted p-3.5">
          <div className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">{mockup.deadlineLabel}</div>
          <div className="mt-0.5 text-[15px] font-semibold text-foreground">{mockup.deadline}</div>
        </div>
        <div className="mt-3 rounded-sm border-2 border-border bg-background p-3.5">
          <div className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">{mockup.replyLabel}</div>
          <div className="mt-0.5 text-sm leading-relaxed text-foreground/80">{mockup.reply}</div>
        </div>
      </motion.div>
    </section>
  );
}
