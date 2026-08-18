"use client";

import { SlidersHorizontal } from "lucide-react";
import type { AppLanguage, SenderCategory } from "@/lib/letters/types";
import { SENDER_CATEGORIES } from "@/lib/letters/types";
import { SENDER_CATEGORY_ICONS } from "@/lib/letters/sender-category";
import { APP_COPY } from "@/lib/i18n/copy";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ActionFilter = "all" | "required" | "none";
export type SortOption = "newest" | "oldest" | "deadline";

function chipClasses(active: boolean) {
  return [
    "flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border-2 border-border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.04em] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active
      ? "bg-primary text-primary-foreground"
      : "bg-card text-foreground hover:bg-muted active:bg-muted",
  ].join(" ");
}

export function LetterFilters({
  language,
  actionFilter,
  onActionFilterChange,
  categoryFilter,
  onToggleCategory,
  onClearFilters,
  sortOption,
  onSortOptionChange,
}: {
  language: AppLanguage;
  actionFilter: ActionFilter;
  onActionFilterChange: (value: ActionFilter) => void;
  categoryFilter: Set<SenderCategory>;
  onToggleCategory: (category: SenderCategory) => void;
  onClearFilters: () => void;
  sortOption: SortOption;
  onSortOptionChange: (value: SortOption) => void;
}) {
  const copy = APP_COPY[language];

  const actionOptions: { value: ActionFilter; label: string }[] = [
    { value: "all", label: copy.dashboard.filterAll },
    { value: "required", label: copy.dashboard.filterActionNeeded },
    { value: "none", label: copy.dashboard.filterNoAction },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: copy.dashboard.sortNewest },
    { value: "oldest", label: copy.dashboard.sortOldest },
    { value: "deadline", label: copy.dashboard.sortDeadline },
  ];

  const activeCount = (actionFilter !== "all" ? 1 : 0) + categoryFilter.size;

  return (
    <div className="mb-4">
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex h-11 items-center gap-2 rounded-full border-2 border-border px-4 text-xs font-bold uppercase tracking-[0.04em] sm:h-9",
          )}
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
          {copy.dashboard.filtersTrigger}
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent dir={language === "ar" ? "rtl" : "ltr"}>
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {copy.dashboard.sortBy}
              </p>
              <div role="radiogroup" aria-label={copy.dashboard.sortBy} className="flex flex-wrap gap-1.5">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={sortOption === option.value}
                    onClick={() => onSortOptionChange(option.value)}
                    className={chipClasses(sortOption === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {copy.dashboard.yourLetters}
              </p>
              <div role="radiogroup" aria-label={copy.dashboard.yourLetters} className="flex flex-wrap gap-1.5">
                {actionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={actionFilter === option.value}
                    onClick={() => onActionFilterChange(option.value)}
                    className={chipClasses(actionFilter === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {copy.dashboard.filterByCategory}
              </p>
              <div role="group" aria-label={copy.dashboard.filterByCategory} className="flex flex-wrap gap-1.5">
                {SENDER_CATEGORIES.map((category) => {
                  const Icon = SENDER_CATEGORY_ICONS[category];
                  const active = categoryFilter.has(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleCategory(category)}
                      className={chipClasses(active)}
                    >
                      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      {copy.senderCategories[category]}
                    </button>
                  );
                })}
              </div>
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-9 w-full rounded-sm border-2 border-border text-xs font-bold",
                )}
              >
                {copy.dashboard.clearFilters}
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
