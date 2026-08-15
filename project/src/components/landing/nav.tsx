"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PapkramLogo } from "@/components/papkram-logo";
import { useMarketingLocale, type MarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const LANGUAGES: { code: MarketingLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "tr", label: "TR" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <header dir={copy.dir} className="sticky top-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-base font-extrabold tracking-[-0.02em] text-foreground sm:text-lg"
        >
          <PapkramLogo />
          Papkram
        </Link>

        <div className="flex shrink-0 items-center gap-0.5 rounded-full border-2 border-border bg-card p-1">
          <Globe className="ml-1 hidden size-4 text-muted-foreground sm:block" strokeWidth={1.5} aria-hidden="true" />
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLocale(lang.code)}
              aria-pressed={locale === lang.code}
              aria-label={lang.label}
              className={`flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-xs font-bold uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 ${
                locale === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="rounded-sm text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.nav.logIn}
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ className: "h-10 rounded-sm font-bold" })}
          >
            {copy.nav.startFreeTrial}
          </Link>
        </div>

        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-card md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-border bg-background px-6 py-4 md:hidden">
          <div className="grid gap-3">
            <Link
              href="/login"
              className="flex h-11 items-center rounded-sm border-2 border-border bg-card px-4 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copy.nav.logIn}
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({ className: "h-11 rounded-sm font-bold" })}
            >
              {copy.nav.startFreeTrial}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
