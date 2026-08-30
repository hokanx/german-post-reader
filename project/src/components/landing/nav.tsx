"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PapkramLogo } from "@/components/papkram-logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LANGUAGE_NAMES, type AppLanguage } from "@/lib/letters/types";
import { useMarketingLocale, type MarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const LANGUAGES: { code: MarketingLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "tr", label: "TR" },
  { code: "de", label: "DE" },
  { code: "uk", label: "UK" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const currentLabel = LANGUAGES.find((lang) => lang.code === locale)?.label ?? locale.toUpperCase();

  return (
    <header
      dir={copy.dir}
      className="sticky top-0 z-40 border-b-2 border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-base font-extrabold tracking-[-0.02em] text-foreground sm:text-lg"
        >
          <PapkramLogo />
          Papkram
        </Link>

        <Popover open={langOpen} onOpenChange={setLangOpen}>
          <PopoverTrigger
            aria-label="Language"
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 text-xs font-bold uppercase tracking-[0.04em] text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Globe className="size-4 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
            {currentLabel}
            <ChevronDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent align="center" className="w-48 p-1.5">
            <div role="radiogroup" aria-label="Language" className="flex flex-col gap-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="radio"
                  aria-checked={locale === lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setLangOpen(false);
                  }}
                  className={`flex h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    locale === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="w-6 shrink-0 text-xs font-bold uppercase tracking-[0.04em]">{lang.label}</span>
                  <span>{LANGUAGE_NAMES[lang.code as AppLanguage]}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

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
