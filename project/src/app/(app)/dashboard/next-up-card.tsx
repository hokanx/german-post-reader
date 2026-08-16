import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import type { AppLanguage } from "@/lib/letters/types";

export function NextUpCard({
  letterId,
  description,
  date,
  language,
  contentLanguage,
  heading,
}: {
  letterId: string;
  description: string;
  date: string;
  language: AppLanguage;
  contentLanguage: AppLanguage;
  heading: string;
}) {
  return (
    <Link
      href={`/letters/${letterId}#deadlines`}
      className="mb-6 flex flex-col gap-2 rounded-md border-2 border-border bg-primary px-6 py-5 text-primary-foreground shadow-[4px_4px_0_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em]">
        <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {heading}
      </span>
      <span
        lang={contentLanguage}
        dir={contentLanguage === "ar" ? "rtl" : "ltr"}
        className="text-xl font-extrabold tracking-[-0.02em]"
      >
        {description}
      </span>
      <span className="text-sm font-medium opacity-90">{formatDate(date, language)}</span>
    </Link>
  );
}
