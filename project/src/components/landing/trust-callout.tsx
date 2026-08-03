"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function TrustCallout() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-start gap-4 rounded-md border-2 border-border bg-muted p-8 md:flex-row md:items-center"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
          <ShieldAlert className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.trust.heading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">{copy.trust.body}</p>
        </div>
      </motion.div>
    </section>
  );
}
