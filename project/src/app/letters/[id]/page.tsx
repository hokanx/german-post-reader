import { notFound, redirect } from "next/navigation";
import { CalendarClock, TriangleAlert, ShieldAlert, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { ReplyDraftCard } from "./reply-draft-card";
import { LANGUAGE_NAMES, type AppLanguage } from "@/lib/letters/types";

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
    .select(
      "id, summary, deadlines, reply_draft, reply_draft_translation, detected_language_confirmed, risk_flags, language, created_at",
    )
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
  const lowConfidence = letter.detected_language_confirmed === false;

  return (
    <>
      <AppHeader backHref="/dashboard" />
      <main className="flex-1 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div dir={isRtl ? "rtl" : "ltr"} className="grid gap-6">
          {lowConfidence && (
            <div className="flex items-start gap-3 rounded-md border-2 border-destructive bg-destructive/10 px-4 py-3">
              <ShieldAlert
                className="mt-0.5 size-5 shrink-0 text-destructive"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">
                We weren&apos;t fully confident this letter was read correctly — the photo or scan may
                have been unclear. Double-check everything below before acting on it.
              </p>
            </div>
          )}

          <div>
            <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Analysis complete
            </span>
            <h1 className="sr-only">Your letter, translated</h1>
          </div>

          <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              <FileText className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
              Summary
            </h2>
            <p className="mt-3 text-xl font-bold leading-snug text-foreground">{letter.summary}</p>
          </section>

          {(deadlines.length > 0 || riskFlags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {deadlines.length > 0 && (
                <a
                  href="#deadlines"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-accent px-3 text-xs font-bold uppercase tracking-[0.04em] text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CalendarClock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {deadlines.length} {deadlines.length === 1 ? "deadline" : "deadlines"}
                </a>
              )}
              {riskFlags.length > 0 && (
                <a
                  href="#risk-flags"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-destructive bg-destructive/10 px-3 text-xs font-bold uppercase tracking-[0.04em] text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <TriangleAlert className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {riskFlags.length} to double-check
                </a>
              )}
            </div>
          )}

          {deadlines.length > 0 && (
            <section
              id="deadlines"
              className="scroll-mt-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]"
            >
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                <CalendarClock className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                Deadlines
              </h2>
              <ul className="mt-4 grid gap-3">
                {deadlines.map((deadline, i) => (
                  <li
                    key={i}
                    className="flex flex-col items-start gap-2 rounded-sm border-2 border-border bg-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
            <section
              id="risk-flags"
              className="scroll-mt-6 rounded-md border-2 border-destructive bg-destructive/10 p-6"
            >
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

          <ReplyDraftCard
            letterId={letter.id}
            initialReplyDraft={letter.reply_draft ?? ""}
            initialTranslation={letter.reply_draft_translation ?? ""}
            translationLanguageLabel={LANGUAGE_NAMES[language]}
            translationDir={isRtl ? "rtl" : "ltr"}
          />
        </div>
      </div>
      </main>
    </>
  );
}
