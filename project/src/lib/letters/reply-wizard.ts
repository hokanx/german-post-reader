const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type RequestTimeOptionId = "plus_one_month" | "plus_two_months" | "instalments";
export type RequestTimeOption = { id: RequestTimeOptionId; date: string | null };

/**
 * The wizard's request_time step offers dates relative to the letter's own
 * deadline rather than asking Gemini to invent one — the app decides what
 * to ask, Gemini only drafts the final reply text (see design spec decision 2).
 */
export function computeRequestTimeOptions(baseDeadlineIso: string | null): RequestTimeOption[] {
  if (!baseDeadlineIso || !ISO_DATE_RE.test(baseDeadlineIso)) return [];

  const base = new Date(`${baseDeadlineIso}T00:00:00Z`);
  const addMonths = (n: number) => {
    const d = new Date(base);
    d.setUTCMonth(d.getUTCMonth() + n);
    return d.toISOString().slice(0, 10);
  };

  return [
    { id: "plus_one_month", date: addMonths(1) },
    { id: "plus_two_months", date: addMonths(2) },
    { id: "instalments", date: null },
  ];
}

/** Opens the user's own mail client with the reply pre-filled — no send-on-behalf-of infrastructure (design spec decision 6). */
export function buildMailtoUrl(body: string, subject: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
