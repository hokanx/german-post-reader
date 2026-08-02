import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-border bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/70 md:flex-row">
        <span className="font-heading font-extrabold tracking-[-0.02em] text-foreground">
          German Post, translated.
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Terms
          </Link>
          <Link
            href="mailto:hello@germanpostreader.app"
            className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
