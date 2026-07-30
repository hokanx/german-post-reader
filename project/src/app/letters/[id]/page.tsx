import { notFound, redirect } from "next/navigation";
import { CalendarClock, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CopyReplyButton } from "./copy-reply-button";
import type { AppLanguage } from "@/lib/letters/types";

type Deadline = { date: string; description: string };

export async function generateMetadata() {
  return {
    title: "Your letter, translated — German Post Letter Reader",
    description: "Plain-language summary, deadlines, and a ready-to-send reply.",
  };
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: letter } = await supabase
    .from("letters")
    .select("id, summary, deadlines, reply_draft, risk_flags, language, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!letter) {
    notFound();
  }

  const language = letter.language as AppLanguage;
  const isRtl = language === "ar";
  const deadlines = (letter.deadlines ?? []) as Deadline[];
  const riskFlags = (letter.risk_flags ?? []) as string[];

  return (
    <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
      <div dir={isRtl ? "rtl" : "ltr"} className="grid gap-6">
        <div>
          <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Analysis complete
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
            {letter.summary}
          </h1>
        </div>

        {deadlines.length > 0 && (
          <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              <CalendarClock className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
              Deadlines
            </h2>
            <ul className="mt-4 grid gap-3">
              {deadlines.map((deadline, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-sm border-2 border-border bg-muted px-4 py-3"
                >
                  <span className="text-sm text-foreground">{deadline.description}</span>
                  <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                    {deadline.date}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {riskFlags.length > 0 && (
          <section className="rounded-md border-2 border-destructive bg-destructive/10 p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              <TriangleAlert className="size-5 text-destructive" strokeWidth={1.5} aria-hidden="true" />
              Worth double-checking
            </h2>
            <ul className="mt-3 grid gap-2">
              {riskFlags.map((flag, i) => (
                <li key={i} className="text-sm text-foreground">
                  • {flag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              Reply draft
            </h2>
            <CopyReplyButton text={letter.reply_draft ?? ""} />
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {letter.reply_draft}
          </p>
        </section>
      </div>
    </main>
  );
}
