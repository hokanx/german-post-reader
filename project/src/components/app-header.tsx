import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { LogoutButton } from "./logout-button";
import type { AppLanguage } from "@/lib/letters/types";

/**
 * Shared chrome for every authenticated route. Previously each page
 * (dashboard, login, signup) hand-copied its own logo link, and /upload,
 * /letters/[id], and /onboarding had no header at all — no way back to the
 * dashboard except the browser back button.
 */
export function AppHeader({
  language,
  backHref,
  backLabel = "Back to dashboard",
}: {
  language?: AppLanguage;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground"
          >
            German Post, translated.
          </Link>
          {backHref && (
            <Link
              href={backHref}
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:flex"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {backLabel}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {language && <LanguageSwitcher current={language} />}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
