import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-border bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/70 md:flex-row">
        <span className="font-heading font-extrabold tracking-[-0.02em] text-foreground">
          German Post, translated.
        </span>
        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="mailto:hello@germanpostreader.app" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
