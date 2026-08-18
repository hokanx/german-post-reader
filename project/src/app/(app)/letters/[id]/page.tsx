import { notFound } from "next/navigation";
import { CalendarClock, CalendarCheck, TriangleAlert, ShieldAlert, FileText, Receipt, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ReplyWizardCard } from "./reply-wizard-card";
import { KeyFactsSection } from "./key-facts-section";
import { AutoTranslateBanner } from "./auto-translate-banner";
import { LetterMenu } from "./letter-menu";
import { LANGUAGE_NAMES, type AppLanguage, type SenderCategory } from "@/lib/letters/types";
import { SENDER_CATEGORY_ICONS } from "@/lib/letters/sender-category";
import { APP_COPY } from "@/lib/i18n/copy";

type Deadline = { date: string; description: string };
type Payment = { description: string; amount: string; source_quote: string };
type Appointment = { description: string; date: string; source_quote: string };

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
        "id, summary, sender_name, sender_category, deadlines, payments, appointments, key_facts, action_required, reply_draft, reply_draft_translation, detected_language_confirmed, risk_flags, language, created_at",
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
  const payments = (letter.payments ?? []) as Payment[];
  const appointments = (letter.appointments ?? []) as Appointment[];
  const riskFlags = (letter.risk_flags ?? []) as string[];
  const keyFacts = (letter.key_facts ?? []) as { label: string; value: string; source_quote: string }[];
  const actionRequired = letter.action_required === true;
  const lowConfidence = letter.detected_language_confirmed === false;
  const copy = APP_COPY[uiLanguage].letters;
  const senderName = letter.sender_name as string | null;
  const senderCategory = letter.sender_category as SenderCategory;
  const SenderIcon = SENDER_CATEGORY_ICONS[senderCategory];
  const senderCategoryLabel = APP_COPY[uiLanguage].senderCategories[senderCategory];
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
            <div className="flex flex-wrap items-center justify-between gap-2">
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
              <LetterMenu
                letterId={letter.id}
                letter={{ senderName, summary: letter.summary, payments, appointments, deadlines, keyFacts }}
                language={uiLanguage}
                copy={{
                  moreOptions: copy.moreOptions,
                  viewOriginalLetter: copy.viewOriginalLetter,
                  shareSummary: copy.shareSummary,
                  openOriginalFailedToast: copy.openOriginalFailedToast,
                  copiedToast: copy.copiedToast,
                  copyFailedToast: copy.copyFailedToast,
                  summaryWatermark: copy.summaryWatermark,
                  paymentsHeading: copy.paymentsHeading,
                  appointmentsHeading: copy.appointmentsHeading,
                  deadlines: copy.deadlines,
                  keyFactsHeading: copy.keyFactsHeading,
                }}
              />
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
            {senderName && (
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-muted">
                  <SenderIcon className="size-4 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span lang="de" dir="ltr" className="text-base font-bold text-foreground">
                  {senderName}
                </span>
                <span className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-muted-foreground">
                  {senderCategoryLabel}
                </span>
              </div>
            )}
            <p
              lang={contentLanguage}
              dir={contentIsRtl ? "rtl" : "ltr"}
              className="mt-3 text-xl font-bold leading-snug text-foreground"
            >
              {letter.summary}
            </p>

            {payments.length > 0 && (
              <div dir={contentIsRtl ? "rtl" : "ltr"} className="mt-4 border-t-2 border-border pt-4">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                  <Receipt className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {copy.paymentsHeading}
                </h3>
                <ul className="mt-2.5 grid gap-2.5">
                  {payments.map((payment, i) => (
                    <li key={i} className="grid gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-border bg-muted px-4 py-2.5">
                        <span lang={contentLanguage} className="text-sm font-bold text-foreground">
                          {payment.description}
                        </span>
                        <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
                          {payment.amount}
                        </span>
                      </div>
                      <p lang="de" dir="ltr" className="flex items-start gap-1.5 px-1 text-left text-xs italic text-foreground/60">
                        <Quote className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        {payment.source_quote}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {appointments.length > 0 && (
              <div dir={contentIsRtl ? "rtl" : "ltr"} className="mt-4 border-t-2 border-border pt-4">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                  <CalendarCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {copy.appointmentsHeading}
                </h3>
                <ul className="mt-2.5 grid gap-2.5">
                  {appointments.map((appointment, i) => (
                    <li key={i} className="grid gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-border bg-muted px-4 py-2.5">
                        <span lang={contentLanguage} className="text-sm font-bold text-foreground">
                          {appointment.description}
                        </span>
                        <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
                          {appointment.date}
                        </span>
                      </div>
                      <p lang="de" dir="ltr" className="flex items-start gap-1.5 px-1 text-left text-xs italic text-foreground/60">
                        <Quote className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        {appointment.source_quote}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <KeyFactsSection facts={keyFacts} heading={copy.keyFactsHeading} contentLanguage={contentLanguage} />

          {(deadlines.length > 0 || riskFlags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {deadlines.length > 0 && (
                <a
                  href="#deadlines"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-accent px-3 text-xs font-bold uppercase tracking-[0.04em] text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {copy.deadlineCount(deadlines.length)}
                </a>
              )}
              {riskFlags.length > 0 && (
                <a
                  href="#risk-flags"
                  className="flex h-9 items-center gap-1.5 rounded-full border-2 border-destructive bg-destructive/10 px-3 text-xs font-bold uppercase tracking-[0.04em] text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <TriangleAlert className="size-4" strokeWidth={1.5} aria-hidden="true" />
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
