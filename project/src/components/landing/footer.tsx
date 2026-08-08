"use client";

import Link from "next/link";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function LandingFooter() {
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <footer dir={copy.dir} className="border-t-2 border-border bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/70 md:flex-row">
        <span className="font-heading font-extrabold tracking-[-0.02em] text-foreground">
          Papkram
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="-my-3.5 flex h-11 items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.footer.privacy}
          </Link>
          <Link
            href="/terms"
            className="-my-3.5 flex h-11 items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.footer.terms}
          </Link>
          <Link
            href="mailto:hello@germanpostreader.app"
            className="-my-3.5 flex h-11 items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.footer.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
