"use client";

import { useState, useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { setLanguage } from "./actions";

const LANGUAGES = [
  { code: "en" as const, label: "English", native: "English" },
  { code: "ar" as const, label: "Arabic", native: "العربية" },
  { code: "tr" as const, label: "Turkish", native: "Türkçe" },
];

export function LanguagePicker() {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  function choose(code: (typeof LANGUAGES)[number]["code"]) {
    setSelected(code);
    startTransition(() => {
      toast.promise(
        setLanguage(code).then((result) => {
          if (!result.ok) {
            throw new Error(result.error.message);
          }
          return result;
        }),
        {
          loading: "Saving your language…",
          success: "Saved",
          error: (error: Error) => error.message,
        },
      );
    });
  }

  return (
    <motion.div
      className="grid gap-4"
      initial={shouldReduceMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {LANGUAGES.map((lang) => (
        <motion.button
          key={lang.code}
          type="button"
          disabled={pending}
          onClick={() => choose(lang.code)}
          variants={
            shouldReduceMotion
              ? undefined
              : {
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }
          }
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="flex items-center justify-between rounded-md border-2 border-border bg-card px-6 py-5 text-left shadow-[4px_4px_0_0_var(--border)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          aria-pressed={selected === lang.code}
        >
          <span>
            <span className="block font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {lang.label}
            </span>
            <span className="mt-0.5 block text-sm text-foreground/70">
              {lang.native}
            </span>
          </span>
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            Choose
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
