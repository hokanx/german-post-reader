"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, ChevronRight, ChevronLeft, ListFilter } from "lucide-react";
import type { AppLanguage, SenderCategory } from "@/lib/letters/types";
import { SENDER_CATEGORY_ICONS } from "@/lib/letters/sender-category";
import { APP_COPY } from "@/lib/i18n/copy";
import { formatDate } from "@/lib/format-date";
import { EmptyState } from "@/components/empty-state";
import { LetterFilters, type ActionFilter } from "./letter-filters";

type LetterRow = {
  id: string;
  summary: string | null;
  sender_category: SenderCategory;
  deadlines: { date: string; description: string }[] | null;
  action_required: boolean;
  created_at: string;
  language: AppLanguage;
};

function soonestDeadline(deadlines: LetterRow["deadlines"]) {
  if (!deadlines || deadlines.length === 0) return null;
  return [...deadlines].sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function LetterList({ letters, language }: { letters: LetterRow[]; language: AppLanguage }) {
  const shouldReduceMotion = useReducedMotion();
  const copy = APP_COPY[language];
  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;

  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<Set<SenderCategory>>(new Set());

  const toggleCategory = (category: SenderCategory) => {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setActionFilter("all");
    setCategoryFilter(new Set());
  };

  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      if (actionFilter === "required" && !letter.action_required) return false;
      if (actionFilter === "none" && letter.action_required) return false;
      if (categoryFilter.size > 0 && !categoryFilter.has(letter.sender_category)) return false;
      return true;
    });
  }, [letters, actionFilter, categoryFilter]);

  return (
    <div>
      <LetterFilters
        language={language}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        categoryFilter={categoryFilter}
        onToggleCategory={toggleCategory}
      />
      {filteredLetters.length === 0 ? (
        <EmptyState
          icon={ListFilter}
          title={copy.dashboard.filterEmptyTitle}
          description={copy.dashboard.filterEmptyDescription}
          action={{ label: copy.dashboard.clearFilters, onClick: clearFilters }}
        />
      ) : (
        <motion.ul
          initial={shouldReduceMotion ? false : "hidden"}
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-3"
        >
          {filteredLetters.map((letter) => {
            const deadline = soonestDeadline(letter.deadlines);
            const CategoryIcon = SENDER_CATEGORY_ICONS[letter.sender_category];
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
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      title={copy.senderCategories[letter.sender_category]}
                      className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-muted"
                    >
                      <CategoryIcon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
                      <span className="sr-only">{copy.senderCategories[letter.sender_category]}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted-foreground">
                        {formatDate(letter.created_at, language)}
                      </p>
                      <p
                        lang={letter.summary ? letter.language : undefined}
                        dir={letter.summary && letter.language === "ar" ? "rtl" : "ltr"}
                        className="mt-1 truncate text-base font-medium text-foreground"
                      >
                        {letter.summary ?? copy.dashboard.analysisPending}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full border-2 border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] ${
                        letter.action_required ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {letter.action_required ? copy.dashboard.actionRequiredBadge : copy.dashboard.noActionBadge}
                    </span>
                    {deadline && (
                      <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-accent-foreground">
                        <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                        {formatDate(deadline.date, language)}
                      </span>
                    )}
                    <Chevron className="hidden size-5 shrink-0 text-muted-foreground sm:block" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
