type Deadline = { date: string; description: string };
type Payment = { description: string; amount: string };
type Appointment = { description: string; date: string };
type KeyFact = { label: string; value: string };

export type ShareableLetter = {
  /**
   * A full, already-translated sentence explaining who the letter is from
   * and (if known) when it was dated — e.g. "This letter is from
   * Stadtwerke München, dated 15 Mar 2026." Composed by the caller (which
   * has access to the account's language and a date formatter) rather than
   * built here, since the sentence structure differs per language in ways
   * a single template string can't express — this function stays a plain
   * text assembler, not an i18n one.
   */
  openingLine: string;
  summary: string;
  payments: Payment[];
  appointments: Appointment[];
  deadlines: Deadline[];
  keyFacts: KeyFact[];
};

export type ShareSummaryCopy = {
  paymentsHeading: string;
  appointmentsHeading: string;
  deadlines: string;
  keyFactsHeading: string;
  summaryWatermark: string;
};

/**
 * Plain-text, ready-to-send/export version of a letter's analysis — reads
 * like someone explaining the letter, not a raw field dump: an opening
 * sentence (who + when) followed by the summary, then reuses the page's
 * own section-heading copy so there's one source of truth for those
 * labels, not a second set of translations. Sections are omitted entirely
 * when empty rather than rendered as an empty heading; the watermark line
 * is always present regardless of what else is included.
 */
export function buildShareSummary(letter: ShareableLetter, copy: ShareSummaryCopy): string {
  const lines: string[] = [];

  if (letter.openingLine) {
    lines.push(letter.openingLine, "");
  }
  lines.push(letter.summary);

  if (letter.payments.length > 0) {
    lines.push("", copy.paymentsHeading);
    for (const p of letter.payments) {
      lines.push(`- ${p.description}: ${p.amount}`);
    }
  }

  if (letter.appointments.length > 0) {
    lines.push("", copy.appointmentsHeading);
    for (const a of letter.appointments) {
      lines.push(`- ${a.description} — ${a.date}`);
    }
  }

  if (letter.deadlines.length > 0) {
    lines.push("", copy.deadlines);
    for (const d of letter.deadlines) {
      lines.push(`- ${d.description} — ${d.date}`);
    }
  }

  if (letter.keyFacts.length > 0) {
    lines.push("", copy.keyFactsHeading);
    for (const f of letter.keyFacts) {
      lines.push(`- ${f.label}: ${f.value}`);
    }
  }

  lines.push("", copy.summaryWatermark);

  return lines.join("\n");
}
