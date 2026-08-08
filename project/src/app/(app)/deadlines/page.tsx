import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/empty-state";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { flattenAndSortDeadlines } from "@/lib/letters/flatten-deadlines";

export const metadata = {
  title: "Deadlines — Papkram",
  robots: { index: false },
};

export default async function DeadlinesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { data: letters }] = await Promise.all([
    supabase.from("profiles").select("language").eq("id", user.id).single(),
    supabase.from("letters").select("id, summary, deadlines").eq("user_id", user.id),
  ]);

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language].deadlines;
  const dir = language === "ar" ? "rtl" : "ltr";
  const deadlines = flattenAndSortDeadlines(letters ?? []);

  return (
    <main dir={dir} className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-4 text-xl font-extrabold tracking-[-0.02em] text-foreground">{copy.heading}</h1>
        {deadlines.length > 0 ? (
          <ul className="grid gap-3">
            {deadlines.map((d, i) => (
              <li key={`${d.letterId}-${i}`}>
                <Link
                  href={`/letters/${d.letterId}#deadlines`}
                  className="flex flex-col gap-2 rounded-md border-2 border-border bg-card px-5 py-4 shadow-[3px_3px_0_0_var(--border)] transition-shadow hover:shadow-[5px_5px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-foreground">{d.description}</p>
                    <p className="mt-0.5 truncate text-xs text-foreground/60">{d.letterSummary}</p>
                  </div>
                  <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                    {d.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title={copy.emptyTitle}
            description={copy.emptyDescription}
            action={{ label: copy.uploadCta, href: "/upload" }}
          />
        )}
      </div>
    </main>
  );
}
