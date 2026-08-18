"use client";

import type { AppLanguage, SenderCategory } from "@/lib/letters/types";
import { SENDER_CATEGORIES } from "@/lib/letters/types";
import { SENDER_CATEGORY_ICONS } from "@/lib/letters/sender-category";
import { APP_COPY } from "@/lib/i18n/copy";

export type ActionFilter = "all" | "required" | "none";

function chipClasses(active: boolean) {
  return [
    "flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.04em] transition-colors sm:min-h-9 sm:px-2.5 sm:py-1",
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
}: {
  language: AppLanguage;
  actionFilter: ActionFilter;
  onActionFilterChange: (value: ActionFilter) => void;
  categoryFilter: Set<SenderCategory>;
  onToggleCategory: (category: SenderCategory) => void;
}) {
  const copy = APP_COPY[language];

  const actionOptions: { value: ActionFilter; label: string }[] = [
    { value: "all", label: copy.dashboard.filterAll },
    { value: "required", label: copy.dashboard.filterActionNeeded },
    { value: "none", label: copy.dashboard.filterNoAction },
  ];

  return (
    <div className="mb-4 flex flex-col gap-1.5">
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
  );
}
