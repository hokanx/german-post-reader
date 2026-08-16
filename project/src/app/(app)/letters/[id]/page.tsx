import { notFound } from "next/navigation";
import { CalendarClock, TriangleAlert, ShieldAlert, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ReplyWizardCard } from "./reply-wizard-card";
import { KeyFactsSection } from "./key-facts-section";
import { AutoTranslateBanner } from "./auto-translate-banner";
import { LANGUAGE_NAMES, type AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

type Deadline = { date: string; description: string };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function generateMetadata() {
  return {
    title: "Your letter, translated — Papkram",
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
    return null;
  }

  const [{ data: letter }, { data: profile }] = await Promise.all([
    supabase
      .from("letters")
      .select(
        "id, summary, deadlines, key_facts, action_required, reply_draft, reply_draft_translation, detected_language_confirmed, risk_flags, language, created_at",
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase.from("profiles").select("language").eq("id", user.id).single(),
  ]);

  if (!letter) {
    notFound();
  }

  // uiLanguage drives every translatable chrome string (headings, badges,
  // the wizard) and always follows the account's current language setting.
  // contentLanguage is the letter's own stored analysis language — it never
  // changes after the fact (nothing gets retranslated), so summary/deadline/
  // quote text keeps its own lang+dir regardless of what uiLanguage the rest
  // of the page is in.
  const uiLanguage = (profile?.language ?? "en") as AppLanguage;
  const contentLanguage = letter.language as AppLanguage;
  const uiIsRtl = uiLanguage === "ar";
  const contentIsRtl = contentLanguage === "ar";
  const deadlines = (letter.deadlines ?? []) as Deadline[];
  const riskFlags = (letter.risk_flags ?? []) as string[];
  const keyFacts = (letter.key_facts ?? []) as { label: string; value: string; source_quote: string }[];
  const actionRequired = letter.action_required === true;
  const lowConfidence = letter.detected_language_confirmed === false;
  const copy = APP_COPY[uiLanguage].letters;
  const soonestDeadlineIso =
    deadlines.filter((d) => ISO_DATE_RE.test(d.date)).sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? null;

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div dir={uiIsRtl ? "rtl" : "ltr"} className="grid gap-6">
          {lowConfidence && (
            <div className="flex items-start gap-3 rounded-md border-2 border-destructive bg-destructive/10 px-4 py-3">
              <ShieldAlert
                className="mt-0.5 size-5 shrink-0 text-destructive"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">{copy.lowConfidenceWarning}</p>
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {copy.analysisComplete}
              </span>
              <span
                className={`rounded-full border-2 border-border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] ${
                  actionRequired ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                }`}
              >
                {actionRequired ? copy.actionRequiredBadge : copy.noActionBadge}
              </span>
            </div>
            <h1 className="sr-only">{copy.analysisComplete}</h1>
            <p className="mt-2 text-sm text-foreground/70">
              {actionRequired ? copy.actionRequiredDescription : copy.noActionDescription}
            </p>
          </div>

          {contentLanguage !== uiLanguage && (
            <AutoTranslateBanner
              letterId={letter.id}
              targetLanguage={uiLanguage}
              bannerText={copy.translatingBanner(LANGUAGE_NAMES[uiLanguage])}
              failedText={copy.translationFailedToast}
              failedRecovery={copy.translationFailedRecovery}
            />
          )}

          <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              <FileText className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
              {copy.summary}
            </h2>
            <p
              lang={contentLanguage}
              dir={contentIsRtl ? "rtl" : "ltr"}
              className="mt-3 text-xl font-bold leading-snug text-foreground"
            >
              {letter.summary}
            </p>
          </section>

          <KeyFactsSection facts={keyFacts} heading={copy.keyFactsHeading} contentLanguage={contentLanguage} />

          {(deadlines.length > 0 || riskFlags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {deadlines.length > 0 && (
                <a
                  href="#deadlines"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-accent px-3 text-xs font-bold uppercase tracking-[0.04em] text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CalendarClock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {copy.deadlineCount(deadlines.length)}
                </a>
              )}
              {riskFlags.length > 0 && (
                <a
                  href="#risk-flags"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-destructive bg-destructive/10 px-3 text-xs font-bold uppercase tracking-[0.04em] text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <TriangleAlert className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {copy.riskFlagCount(riskFlags.length)}
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
                {copy.deadlines}
              </h2>
              <ul className="mt-4 grid gap-3">
                {deadlines.map((deadline, i) => (
                  <li
                    key={i}
                    className="flex flex-col items-start gap-2 rounded-sm border-2 border-border bg-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span lang={contentLanguage} dir={contentIsRtl ? "rtl" : "ltr"} className="text-sm text-foreground">
                      {deadline.description}
                    </span>
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
                {copy.worthChecking}
              </h2>
              <ul className="mt-3 grid gap-2">
                {riskFlags.map((flag, i) => (
                  <li key={i} lang={contentLanguage} dir={contentIsRtl ? "rtl" : "ltr"} className="text-sm text-foreground">
                    • {flag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ReplyWizardCard
            letterId={letter.id}
            uiLanguage={uiLanguage}
            initialReplyDraft={letter.reply_draft ?? ""}
            initialTranslation={letter.reply_draft_translation ?? ""}
            initialTranslationLanguage={contentLanguage}
            soonestDeadlineIso={soonestDeadlineIso}
          />
        </div>
      </div>
      </main>
  );
}
