"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { StampBadge } from "./stamp-badge";

export function CtaBand() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="bg-primary py-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <StampBadge label="START TODAY" className="w-24 rotate-[3deg] opacity-95" />
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-primary-foreground md:text-4xl">
          Stop guessing what your mail says.
        </h2>
        <Link
          href="/signup"
          className={buttonVariants({
            variant: "secondary",
            className: "h-12 rounded-sm px-6 text-base font-bold",
          })}
        >
          Start free trial
        </Link>
      </div>
    </motion.section>
  );
}
