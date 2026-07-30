"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, ChevronRight } from "lucide-react";

type LetterRow = {
  id: string;
  summary: string | null;
  deadlines: { date: string; description: string }[] | null;
  created_at: string;
};

function soonestDeadline(deadlines: LetterRow["deadlines"]) {
  if (!deadlines || deadlines.length === 0) return null;
  return [...deadlines].sort((a, b) => a.date.localeCompare(b.date))[0];
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function LetterList({ letters }: { letters: LetterRow[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.ul
      initial={shouldReduceMotion ? false : "hidden"}
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-3"
    >
      {letters.map((letter) => {
        const deadline = soonestDeadline(letter.deadlines);
        return (
          <motion.li
            key={letter.id}
            className="min-w-0"
            variants={
              shouldReduceMotion
                ? undefined
                : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
            }
          >
            <Link
              href={`/letters/${letter.id}`}
              className="flex w-full flex-col gap-3 overflow-hidden rounded-md border-2 border-border bg-card px-5 py-4 shadow-[3px_3px_0_0_var(--border)] transition-shadow hover:shadow-[5px_5px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted-foreground">
                  {formatDate(letter.created_at)}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {letter.summary ?? "Analysis pending…"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {deadline && (
                  <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-accent-foreground">
                    <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    {formatDate(deadline.date)}
                  </span>
                )}
                <ChevronRight className="hidden size-5 shrink-0 text-muted-foreground sm:block" strokeWidth={1.5} aria-hidden="true" />
              </div>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
