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

/** Pulls every deadline out of every letter into one flat, date-ascending list, each still pointing back at its source letter. */
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
  return flat.sort((a, b) => a.date.localeCompare(b.date));
}
