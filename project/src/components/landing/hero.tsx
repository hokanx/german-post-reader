"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StampBadge } from "./stamp-badge";
import { useMarketingLocale, type MarketingLocale } from "./locale-context";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MOCKUP_COPY: Record<
  MarketingLocale,
  { chip: string; summary: string; deadline: string; reply: string; dir: "ltr" | "rtl" }
> = {
  en: {
    chip: "Analysis complete",
    summary: "Stadtwerke München is asking for an extra 187.42 EUR from your 2025 electricity bill.",
    deadline: "Pay by 28 Feb 2026",
    reply: "“I am writing to confirm the payment of 187.42 EUR was transferred on…”",
    dir: "ltr",
  },
  ar: {
    chip: "تم التحليل",
    summary: "شركة كهرباء ميونخ تطلب مبلغاً إضافياً قدره 187.42 يورو من فاتورة الكهرباء لعام 2025.",
    deadline: "الدفع قبل 28 فبراير 2026",
    reply: "«أكتب لأؤكد أن مبلغ 187.42 يورو تم تحويله بتاريخ...»",
    dir: "rtl",
  },
  tr: {
    chip: "Analiz tamamlandı",
    summary: "Stadtwerke München, 2025 elektrik faturanız için 187,42 EUR ek ödeme talep ediyor.",
    deadline: "Son ödeme: 28 Şubat 2026",
    reply: "“187,42 EUR tutarındaki ödemenin yapıldığını onaylamak için yazıyorum…”",
    dir: "ltr",
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const mockup = MOCKUP_COPY[locale];

  const fadeRise = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
      };

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 md:grid-cols-2 md:items-center md:pt-24 md:pb-28">
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeRise} className="relative mb-6 w-fit">
          <StampBadge label="3 FREE LETTERS" className="rotate-[-4deg]" />
        </motion.div>
        <motion.h1
          variants={fadeRise}
          className="text-5xl font-extrabold tracking-[-0.02em] text-foreground md:text-7xl"
        >
          German post,
          <br />
          finally readable.
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-6 max-w-md text-lg text-foreground/80">
          Upload a photo or PDF of any German letter. Get a plain-language
          summary, your deadlines, and a ready-to-send reply — in English,
          Arabic, or Turkish.
        </motion.p>
        <motion.div variants={fadeRise} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className={buttonVariants({ className: "h-12 rounded-sm px-6 text-base font-bold" })}
          >
            Start free trial
          </Link>
          <span className="text-sm text-foreground/60">No credit card needed</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
        dir={mockup.dir}
        className="mx-auto w-full max-w-sm rounded-md border-2 border-border bg-card p-6 shadow-[8px_8px_0_0_var(--border)]"
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
    </section>
  );
}
