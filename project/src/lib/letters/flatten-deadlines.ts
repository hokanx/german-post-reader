export type FlatDeadline = {
  date: string;
  description: string;
  letterId: string;
  letterSummary: string;
};

type LetterWithDeadlines = {
  id: string;
  summary: string | null;
  deadlines: { date: string; description: string }[] | null;
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Pulls every deadline out of every letter into one flat list, soonest
 * ISO-dated deadline first. Gemini's schema documents `date` as ISO 8601
 * "if known, otherwise the date as written in the letter" — so it can be
 * free text (e.g. "innerhalb von 14 Tagen"). A lexical sort across mixed
 * ISO and free-text strings would scramble the ordering, so only the
 * confirmed-ISO dates are sorted; anything else is appended afterward, in
 * its original relative order, rather than guessed at.
 */
export function flattenAndSortDeadlines(letters: LetterWithDeadlines[]): FlatDeadline[] {
  const flat: FlatDeadline[] = [];
  for (const letter of letters) {
    for (const deadline of letter.deadlines ?? []) {
      flat.push({
        date: deadline.date,
        description: deadline.description,
        letterId: letter.id,
        letterSummary: letter.summary ?? "",
      });
    }
  }

  const isoDeadlines = flat.filter((d) => ISO_DATE_RE.test(d.date));
  const nonIsoDeadlines = flat.filter((d) => !ISO_DATE_RE.test(d.date));
  isoDeadlines.sort((a, b) => a.date.localeCompare(b.date));

  return [...isoDeadlines, ...nonIsoDeadlines];
}
