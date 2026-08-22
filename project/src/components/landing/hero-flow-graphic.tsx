/**
 * The hero's "before → Papkram → after" strip: a dense German letter card,
 * an arrow, the Papkram mark, another arrow, and a plain-language result
 * card — replaces the old "N letters free" stamp badge as the hero's
 * illustrative graphic. `#f87171` (a red not in the locked token set) in
 * the source design becomes `bg-destructive` here — same alert-red intent,
 * kept inside the app's actual color tokens rather than a one-off hex.
 */
export function HeroFlowGraphic({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="mb-8.5 flex items-center gap-3.5">
      {/* Letter card: dense, dark placeholder lines + an alert dot */}
      <div className="relative flex h-31 w-24.5 rotate-[-3deg] flex-col gap-1.5 rounded-[8px] border-2 border-border bg-card p-3 shadow-[4px_4px_0_0_var(--border)]">
        <span className="h-[5px] w-[56%] rounded-full bg-foreground" />
        <span className="h-[3px] w-[88%] rounded-full bg-foreground/20" />
        <span className="h-[3px] w-[96%] rounded-full bg-foreground/20" />
        <span className="h-[3px] w-[72%] rounded-full bg-foreground/20" />
        <span className="h-[3px] w-[92%] rounded-full bg-foreground/20" />
        <span className="h-[3px] w-[60%] rounded-full bg-foreground/20" />
        <span className="absolute -right-2.25 -bottom-2.25 size-[30px] rotate-[-14deg] rounded-full border-2 border-border bg-destructive" />
      </div>

      <ArrowIcon />

      <svg viewBox="0 0 480 480" className="size-13 shrink-0" aria-hidden="true">
        <rect x="46" y="48" width="392" height="392" rx="118" fill="var(--border)" />
        <rect x="26" y="24" width="392" height="392" rx="118" fill="var(--accent)" stroke="var(--border)" strokeWidth="16" />
        <g transform="translate(222,220)">
          <rect x="-102" y="-68" width="204" height="136" rx="26" fill="var(--card)" stroke="var(--border)" strokeWidth="15" />
          <path d="M-90 -54 L0 12 L90 -54" fill="none" stroke="var(--border)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      <ArrowIcon />

      {/* Result card: plain-language, purple-shadowed, with a CTA-style pill */}
      <div className="flex h-31 w-24.5 rotate-[2deg] flex-col gap-2 rounded-[8px] border-2 border-border bg-card p-3 shadow-[4px_4px_0_0_var(--primary)]">
        <span className="h-[5px] w-[64%] rounded-full bg-primary" />
        <span className="h-[3px] w-[90%] rounded-full bg-foreground/42" />
        <span className="h-[3px] w-[78%] rounded-full bg-foreground/42" />
        <span className="mt-auto h-4.5 rounded-full border-2 border-border bg-accent" />
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="var(--border)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
