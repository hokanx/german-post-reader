"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { PapkramLogo } from "@/components/papkram-logo";

/** Shared top bar for every authenticated route, plus onboarding. Navigation (language switcher, logout, section links) lives in AppNav and /settings now - this handles branding plus a back-to-dashboard link on every page that isn't the dashboard itself. */
export function AppHeader({ language }: { language?: AppLanguage }) {
  const copy = APP_COPY[language ?? "en"].header;
  const isRtl = language === "ar";
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <header
      dir={isRtl ? "rtl" : "ltr"}
      className="border-b-2 border-border bg-background pt-[env(safe-area-inset-top)]"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
        {!isDashboard && (
          <Link
            href="/dashboard"
            aria-label={copy.backToDashboard}
            className="flex size-11 shrink-0 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring -ms-2.5"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-sm font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PapkramLogo />
          {copy.logo}
        </Link>
      </div>
    </header>
  );
}
