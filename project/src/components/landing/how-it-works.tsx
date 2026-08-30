"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

/** Each step's shot pans slowly (from% -> to% translateY) while its progress bar fills, over DEMO_DUR ms. */
const DEMO: { from: number; to: number }[] = [
  { from: 2, to: 12 },
  { from: 1, to: 19 },
  { from: 9, to: 22 },
];
const DEMO_DUR = 5400;
const TICK_MS = 40;

// Placeholder screenshots (English UI) reused for de/uk pending real de/uk captures.
const SHOTS: Record<"en" | "ar" | "tr" | "de" | "uk", [string, string, string]> = {
  en: ["/how-it-works/en-1-upload.png", "/how-it-works/en-2-analysis.png", "/how-it-works/en-3-reply.png"],
  ar: ["/how-it-works/ar-1-upload.png", "/how-it-works/ar-2-analysis.png", "/how-it-works/ar-3-reply.png"],
  tr: ["/how-it-works/tr-1-upload.png", "/how-it-works/tr-2-analysis.png", "/how-it-works/tr-3-reply.png"],
  de: ["/how-it-works/en-1-upload.png", "/how-it-works/en-2-analysis.png", "/how-it-works/en-3-reply.png"],
  uk: ["/how-it-works/en-1-upload.png", "/how-it-works/en-2-analysis.png", "/how-it-works/en-3-reply.png"],
};

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const shots = SHOTS[locale];

  const shotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scanRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef(0);
  const t0Ref = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    function applyStep(step: number) {
      shotRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = i === step ? "1" : "0";
      });
      if (step === 1 && scanRef.current) {
        scanRef.current.style.animation = "none";
        void scanRef.current.offsetWidth;
        scanRef.current.style.animation = "pk-scan 2.2s ease-out 1";
      }
    }

    function goStep(next: number) {
      stepRef.current = next % DEMO.length;
      t0Ref.current = Date.now();
      elapsedRef.current = 0;
      applyStep(stepRef.current);
    }

    t0Ref.current = Date.now();
    applyStep(0);
    const timer = setInterval(() => {
      const now = Date.now();
      if (pausedRef.current) {
        t0Ref.current = now - elapsedRef.current;
      } else {
        elapsedRef.current = now - t0Ref.current;
      }
      let t = elapsedRef.current / DEMO_DUR;
      if (t >= 1) {
        goStep(stepRef.current + 1);
        t = 0;
      }
      const s = DEMO[stepRef.current];
      const eased = 1 - Math.pow(1 - t, 2);
      const y = s.from + (s.to - s.from) * eased;
      const activeShot = shotRefs.current[stepRef.current];
      if (activeShot) activeShot.style.transform = `translateY(${-y}%)`;
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.width = i === stepRef.current ? `${t * 100}%` : "0%";
      });
    }, TICK_MS);

    return () => clearInterval(timer);
    // Re-mounts the whole demo loop on locale change (shots array below also
    // depends on locale) — simplest way to keep the two in sync.
  }, [locale, shouldReduceMotion]);

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-24 md:py-26">
      <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-accent-foreground">
        {copy.howItWorks.eyebrow}
      </span>
      <h2
        className="mt-5 font-heading font-extrabold tracking-[-0.025em] text-foreground"
        style={{ fontSize: "clamp(34px,4vw,52px)", lineHeight: 1.02 }}
      >
        {copy.howItWorks.heading}
      </h2>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid grid-cols-3 gap-3 sm:gap-4"
      >
        {copy.howItWorks.steps.map((step, i) => (
          <motion.div
            key={step.title}
            variants={shouldReduceMotion ? undefined : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="rounded-sm border-2 border-border bg-card p-3.5 sm:p-4.5"
          >
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-heading text-xs font-extrabold text-primary sm:text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-sm font-extrabold tracking-[-0.02em] text-foreground sm:text-base">
                {step.title}
              </h3>
            </div>
            <p className="mt-1.5 hidden text-[13px] leading-snug text-foreground/72 sm:block">{step.description}</p>
            <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-foreground/12 sm:mt-3">
              <div
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="h-full w-0 bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <div
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          onPointerLeave={() => {
            pausedRef.current = false;
          }}
          className="relative w-full max-w-[420px] overflow-hidden rounded-xl border-2 border-border bg-background shadow-[8px_8px_0_0_var(--border)]"
          style={{ aspectRatio: "1000 / 1150" }}
        >
          {shots.map((src, i) => (
            <div
              key={src}
              ref={(el) => {
                shotRefs.current[i] = el;
              }}
              className="absolute top-0 left-0 w-full transition-opacity duration-500"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={copy.howItWorks.shotAlts[i]}
                width={1000}
                height={2168}
                className="block w-full"
                priority={i === 0}
              />
            </div>
          ))}
          <div
            ref={scanRef}
            className="pointer-events-none absolute top-0 right-0 left-0 h-[110px] bg-gradient-to-b from-primary/0 via-primary/22 to-primary/0 opacity-0"
          />
        </div>
        <span className="text-[13px] text-foreground/55">{copy.howItWorks.demoCaption}</span>
      </div>
    </section>
  );
}
