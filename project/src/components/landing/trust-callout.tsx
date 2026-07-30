"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export function TrustCallout() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
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
            We tell you when we&apos;re not sure
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            German bureaucratic letters are dense — amounts and dates matter.
            If anything in a letter is ambiguous, we flag it plainly instead
            of guessing. Never a silent guess on a number that could cost you.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
