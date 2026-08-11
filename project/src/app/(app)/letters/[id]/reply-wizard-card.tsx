"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Languages, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPLY_TONE_LABELS, type AppLanguage, type ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { formatDate } from "@/lib/format-date";
import { computeRequestTimeOptions, buildMailtoUrl, type RequestTimeOptionId } from "@/lib/letters/reply-wizard";
import { CopyReplyButton } from "./copy-reply-button";
import { regenerateReply } from "./actions";

const TONES = Object.keys(REPLY_TONE_LABELS.en) as ReplyTone[];
type Step = "intent" | "follow-up" | "reply";

export function ReplyWizardCard({
  letterId,
  language,
  initialReplyDraft,
  initialTranslation,
  translationLanguageLabel,
  translationDir,
  soonestDeadlineIso,
}: {
  letterId: string;
  language: AppLanguage;
  initialReplyDraft: string;
  initialTranslation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
  soonestDeadlineIso: string | null;
}) {
  const copy = APP_COPY[language].letters;
  const wizard = copy.wizard;
  const toneLabels = REPLY_TONE_LABELS[language];

  const [step, setStep] = useState<Step>("intent");
  const [tone, setTone] = useState<ReplyTone | null>(null);
  const [freeText, setFreeText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState(initialReplyDraft);
  const [translation, setTranslation] = useState(initialTranslation);
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, startTransition] = useTransition();

  const requestTimeOptions = computeRequestTimeOptions(soonestDeadlineIso);

  function requestTimeLabel(id: RequestTimeOptionId) {
    if (id === "plus_one_month") return wizard.requestTimeOptionPlusOneMonth;
    if (id === "plus_two_months") return wizard.requestTimeOptionPlusTwoMonths;
    return wizard.requestTimeOptionInstalments;
  }

  function handleToneSelect(nextTone: ReplyTone) {
    setTone(nextTone);
    setFreeText("");
    setValidationError(null);
    if (nextTone === "confirm") {
      submit(nextTone, undefined);
    } else {
      setStep("follow-up");
    }
  }

  function handleRequestTimeOption(option: { id: RequestTimeOptionId; date: string | null }) {
    const answer = option.date ? wizard.answerByDate(formatDate(option.date, language)) : wizard.answerInstalments;
    submit("request_time", answer);
  }

  function handleFreeTextContinue() {
    if (freeText.trim().length === 0) {
      setValidationError(wizard.answerRequired);
      return;
    }
    submit(tone!, freeText.trim());
  }

  function submit(submittedTone: ReplyTone, answer: string | undefined) {
    if (pending) return;
    startTransition(async () => {
      const result = await regenerateReply(letterId, submittedTone, answer);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      setReplyDraft(result.data.reply_draft);
      setTranslation(result.data.reply_draft_translation);
      setStep("reply");
      toast.success(copy.replyRedraftedToast);
    });
  }

  function handleEditAnswer() {
    setStep(tone === "confirm" ? "intent" : "follow-up");
  }

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      {step === "intent" && (
        <>
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {wizard.stepIntentHeading}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.replyToneGroupLabel}>
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                disabled={pending}
                onClick={() => handleToneSelect(t)}
                className="flex h-11 items-center rounded-full border-2 border-border bg-muted px-4 text-sm font-bold uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {toneLabels[t]}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "follow-up" && tone && tone !== "confirm" && (
        <>
          <button
            type="button"
            onClick={() => setStep("intent")}
            className="mb-4 flex h-9 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {wizard.backButton}
          </button>

          {tone === "request_time" && (
            <>
              <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                {wizard.requestTimeQuestion}
              </h2>
              <div className="mt-4 grid gap-2">
                {requestTimeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={pending}
                    onClick={() => handleRequestTimeOption(option)}
                    className="flex h-11 items-center justify-between rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  >
                    <span>{requestTimeLabel(option.id)}</span>
                    {option.date && <span className="text-muted-foreground">{formatDate(option.date, language)}</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {(tone === "object" || tone === "clarify") && (
            <>
              <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                {tone === "object" ? wizard.objectQuestion : wizard.clarifyQuestion}
              </h2>
              <textarea
                value={freeText}
                onChange={(e) => {
                  setFreeText(e.target.value);
                  setValidationError(null);
                }}
                placeholder={tone === "object" ? wizard.objectPlaceholder : wizard.clarifyPlaceholder}
                rows={4}
                className="mt-4 w-full rounded-sm border-2 border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {validationError && <p className="mt-2 text-sm text-destructive">{validationError}</p>}
              <Button
                type="button"
                onClick={handleFreeTextContinue}
                disabled={pending}
                className="mt-4 h-11 rounded-sm text-sm font-bold"
              >
                {wizard.continueButton}
              </Button>
            </>
          )}
        </>
      )}

      {step === "reply" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              {copy.yourReplyInGerman}
            </h2>
            <div className="flex gap-2">
              <CopyReplyButton text={replyDraft} copy={copy} />
              <a
                href={buildMailtoUrl(replyDraft, wizard.mailtoSubject)}
                className="flex h-10 items-center gap-2 rounded-sm border-2 border-border bg-muted px-3 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {wizard.sendByEmailButton}
              </a>
            </div>
          </div>
          <p className="mt-1 text-sm text-foreground/60">{copy.readyToSend}</p>

          <p
            dir="ltr"
            aria-busy={pending}
            className={`mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground transition-opacity ${pending ? "opacity-50" : ""}`}
          >
            {pending ? wizard.generatingReply : replyDraft}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowTranslation((v) => !v)}
              aria-expanded={showTranslation}
              aria-controls="reply-translation"
              className="flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Languages className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {showTranslation
                ? copy.hideTranslation(translationLanguageLabel)
                : copy.showTranslation(translationLanguageLabel)}
            </button>
            <button
              type="button"
              onClick={handleEditAnswer}
              disabled={pending}
              className="flex h-11 items-center rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {wizard.editAnswerButton}
            </button>
          </div>

          {showTranslation && (
            <div
              id="reply-translation"
              dir={translationDir}
              className="mt-3 whitespace-pre-wrap rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground/80"
            >
              {pending ? "…" : translation}
            </div>
          )}
        </>
      )}
    </section>
  );
}
