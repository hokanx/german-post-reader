import Link from "next/link";
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
        <Link
          href="/"
          className="mb-8 inline-block font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground"
        >
          {copy.header.logo}
        </Link>
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
