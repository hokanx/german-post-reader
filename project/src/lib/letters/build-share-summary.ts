type Deadline = { date: string; description: string };
type Payment = { description: string; amount: string };
type Appointment = { description: string; date: string };
type KeyFact = { label: string; value: string };

export type ShareableLetter = {
  senderName: string | null;
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
 * Plain-text, ready-to-send/export version of a letter's analysis — reuses
 * the page's own section-heading copy so there's one source of truth for
 * those labels, not a second set of translations. Sections are omitted
 * entirely when empty rather than rendered as an empty heading; the
 * watermark line is always present regardless of what else is included.
 */
export function buildShareSummary(letter: ShareableLetter, copy: ShareSummaryCopy): string {
  const lines: string[] = [];

  if (letter.senderName) {
    lines.push(letter.senderName);
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
