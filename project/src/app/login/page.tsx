import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { APP_COPY } from "@/lib/i18n/copy";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Log in — Papkram",
  description: "Log in to see your letter history and continue where you left off.",
};

export default async function LoginPage() {
  const language = await getPreAuthLanguage();
  const copy = APP_COPY[language];

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="flex min-h-full flex-1 items-start justify-center bg-background px-6 py-12 sm:items-center sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <Link
            href="/"
            aria-label={copy.header.backToHome}
            className="-ms-2.5 flex size-11 shrink-0 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.header.logo}
          </Link>
        </div>
        <div className="rounded-lg border-2 border-border bg-card p-8 shadow-[4px_4px_0_0_var(--border)]">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.auth.login.heading}
          </h1>
          <p className="mt-2 text-sm text-foreground/70">{copy.auth.login.subhead}</p>
          <div className="mt-6">
            <LoginForm language={language} />
          </div>
        </div>
      </div>
    </main>
  );
}
