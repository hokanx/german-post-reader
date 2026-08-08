import Link from "next/link";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

/** Logo-only header for logged-out static pages (privacy, terms) that previously had no way to navigate anywhere else. */
export function MinimalHeader({ language = "en" }: { language?: AppLanguage }) {
  return (
    <header dir={language === "ar" ? "rtl" : "ltr"} className="border-b-2 border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-4">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
          {APP_COPY[language].header.logo}
        </Link>
      </div>
    </header>
  );
}
