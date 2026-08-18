"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { buildCalendarWeeks } from "@/lib/letters/build-calendar-weeks";
import type { FlatDeadline } from "@/lib/letters/flatten-deadlines";
import type { AppLanguage } from "@/lib/letters/types";
import { cn } from "@/lib/utils";

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAY_REFERENCE_MONDAY = new Date(2024, 0, 1); // a known Monday

export function DeadlinesCalendar({
  deadlinesByDay,
  language,
  locale,
  prevMonthLabel,
  nextMonthLabel,
  todayLabel,
  deadlineWordSingular,
  deadlineWordPlural,
}: {
  deadlinesByDay: Record<string, FlatDeadline[]>;
  language: AppLanguage;
  locale: string;
  prevMonthLabel: string;
  nextMonthLabel: string;
  todayLabel: string;
  deadlineWordSingular: string;
  deadlineWordPlural: string;
}) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const todayIso = useMemo(() => toIso(new Date()), []);

  const initialMonth = useMemo(() => {
    const upcomingIsos = Object.keys(deadlinesByDay)
      .filter((iso) => iso >= todayIso)
      .sort();
    const anchor = upcomingIsos[0] ?? todayIso;
    const [y, m] = anchor.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [deadlinesByDay, todayIso]);

  const [viewedMonth, setViewedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const weeks = useMemo(() => buildCalendarWeeks(viewedMonth), [viewedMonth]);
  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(viewedMonth),
    [locale, viewedMonth],
  );
  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(WEEKDAY_REFERENCE_MONDAY);
      day.setDate(WEEKDAY_REFERENCE_MONDAY.getDate() + i);
      return formatter.format(day);
    });
  }, [locale]);

  function goToMonth(next: Date) {
    setViewedMonth(next);
    setSelectedDay(null);
  }

  return (
    <section className="rounded-md border-2 border-border bg-card p-4 shadow-[4px_4px_0_0_var(--border)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1))}
          aria-label={prevMonthLabel}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-9"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="font-heading text-base font-extrabold tracking-[-0.02em] text-foreground sm:text-lg">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => goToMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {todayLabel}
          </button>
        </div>
        <button
          type="button"
          onClick={() => goToMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1))}
          aria-label={nextMonthLabel}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-9"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* A calendar's day-of-week progression is a structural convention,
          not translatable content — kept LTR even on the Arabic page (see
          docs/superpowers/specs/deadlines-calendar.md). */}
      <div dir="ltr">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {weekdayLabels.map((label, i) => (
            <div key={i} className="py-1 text-center text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {weeks.flat().map((cell) => {
            const dayDeadlines = deadlinesByDay[cell.iso] ?? [];
            const dayNumber = Number(cell.iso.slice(8, 10));
            const isToday = cell.iso === todayIso;
            const isSelected = cell.iso === selectedDay;

            const baseClasses = cn(
              "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-sm border-2 text-sm font-bold transition-colors",
              cell.inCurrentMonth ? "text-foreground" : "text-foreground/30",
              isSelected
                ? "border-border bg-primary text-primary-foreground"
                : isToday
                  ? "border-primary bg-card"
                  : "border-border bg-card",
            );

            if (dayDeadlines.length === 0) {
              return (
                <span key={cell.iso} className={baseClasses}>
                  {dayNumber}
                </span>
              );
            }

            return (
              <Popover
                key={cell.iso}
                open={isSelected}
                onOpenChange={(open) => setSelectedDay(open ? cell.iso : null)}
              >
                <PopoverTrigger
                  aria-label={`${dayNumber} — ${dayDeadlines.length} ${dayDeadlines.length === 1 ? deadlineWordSingular : deadlineWordPlural}`}
                  className={cn(baseClasses, "min-h-11 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
                >
                  {dayNumber}
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full text-[10px] font-extrabold",
                      isSelected ? "bg-primary-foreground text-primary" : "bg-accent text-accent-foreground",
                    )}
                  >
                    {dayDeadlines.length}
                  </span>
                </PopoverTrigger>
                <PopoverContent dir={dir} align="center">
                  <ul className="grid gap-2.5">
                    {dayDeadlines.map((d, i) => (
                      <li key={`${d.letterId}-${i}`} className="min-w-0">
                        <Link
                          href={`/letters/${d.letterId}#deadlines`}
                          className="block rounded-sm border-2 border-border bg-muted px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <p lang={d.language} dir={d.language === "ar" ? "rtl" : "ltr"} className="truncate text-sm font-medium">
                            {d.description}
                          </p>
                          <p lang={d.language} dir={d.language === "ar" ? "rtl" : "ltr"} className="mt-0.5 truncate text-xs opacity-70">
                            {d.letterSummary}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </section>
  );
}
