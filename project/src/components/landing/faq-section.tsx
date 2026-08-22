"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function FaqSection() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.faq;

  return (
    <section dir={copy.dir} className="border-t-2 border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-26">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-muted-foreground">
            {t.eyebrow}
          </span>
          <h2
            className="mt-5 mb-11 font-heading font-extrabold tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(34px,4vw,52px)", lineHeight: 1.02 }}
          >
            {t.heading}
          </h2>
        </motion.div>

        {t.items.map((item, i) => (
          <details key={item.question} className={`group border-t-2 border-border ${i === t.items.length - 1 ? "border-b-2" : ""}`}>
            <summary className="flex cursor-pointer items-center justify-between gap-5 py-6 px-1 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="font-heading text-xl font-bold tracking-[-0.01em] text-foreground">{item.question}</span>
              <span
                className="size-3.5 shrink-0 rotate-45 border-r-[2.5px] border-b-[2.5px] border-primary transition-transform duration-200 group-open:-rotate-135"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-[52em] pb-6.5 text-base leading-relaxed text-foreground/75 [text-wrap:pretty]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
