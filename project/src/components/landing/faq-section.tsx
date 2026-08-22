"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/ui/accordion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function FaqSection() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.faq;

  return (
    <section dir={copy.dir} className="mx-auto max-w-3xl px-6 py-20">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {t.eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
          {t.heading}
        </h2>
      </motion.div>

      <Accordion className="mt-8 rounded-md border-2 border-border bg-card px-6 shadow-[4px_4px_0_0_var(--border)]">
        {t.items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionPanel>{item.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
