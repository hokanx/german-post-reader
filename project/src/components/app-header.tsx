import Link from "next/link";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

/** Shared top bar for every authenticated route, plus onboarding. Navigation (language switcher, logout, section links) lives in AppNav and /settings now - this is just branding. */
export function AppHeader({ language }: { language?: AppLanguage }) {
  const copy = APP_COPY[language ?? "en"].header;
  const isRtl = language === "ar";

  return (
    <header dir={isRtl ? "rtl" : "ltr"} className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
        <Link
          href="/dashboard"
          className="rounded-sm font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copy.logo}
        </Link>
      </div>
    </header>
  );
}
