import { Quote } from "lucide-react";

type KeyFact = { label: string; value: string; source_quote: string };

export function KeyFactsSection({ facts, heading }: { facts: KeyFact[]; heading: string }) {
  if (facts.length === 0) return null;

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">{heading}</h2>
      <ul className="mt-4 grid gap-4">
        {facts.map((fact, i) => (
          <li key={i} className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.04em] text-muted-foreground">{fact.label}</span>
              <span className="text-base font-bold text-foreground">{fact.value}</span>
            </div>
            <p lang="de" dir="ltr" className="flex items-start gap-1.5 text-left text-sm italic text-foreground/70">
              <Quote className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {fact.source_quote}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
