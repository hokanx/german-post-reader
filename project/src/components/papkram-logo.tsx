/**
 * The real brand mark (from the Papkram Brand Kit's papkram-icon.svg),
 * inlined so it stays crisp at any display size. Uses the mark's own fixed
 * brand colors rather than the app's semantic tokens — a logo doesn't
 * reflow to the current theme, it's a fixed identity (same reasoning the
 * favicon generators in src/app/icon.tsx already rely on).
 */
export function PapkramLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label="Papkram"
      className={`size-7 shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="papkram-mark-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FB9A4B" />
          <stop offset="1" stopColor="#F07E31" />
        </linearGradient>
      </defs>
      <rect x="50" y="52" width="404" height="404" rx="122" fill="#1A0A2E" />
      <rect x="28" y="24" width="404" height="404" rx="122" fill="url(#papkram-mark-amber)" stroke="#1A0A2E" strokeWidth="16" />
      <g transform="translate(230,226)">
        <rect x="-105" y="-70" width="210" height="140" rx="26" fill="#FFFFFF" stroke="#1A0A2E" strokeWidth="15" />
        <path d="M-93 -56 L0 12 L93 -56" fill="none" stroke="#1A0A2E" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
