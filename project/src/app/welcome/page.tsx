import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { ShareButtons } from "@/components/share-buttons";
import { buttonVariants } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export const metadata = {
  title: "You're in — Papkram",
  robots: { index: false },
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("language").eq("id", user.id).single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language].welcome;
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <>
      <AppHeader language={language} />
      <main dir={dir} className="flex flex-1 flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
              {copy.heading}
            </h1>
            <p className="mt-3 text-base text-foreground/80">{copy.body}</p>

            <div className="mt-10 rounded-md border-2 border-border bg-card p-6 text-start shadow-[4px_4px_0_0_var(--border)]">
              <p className="mb-4 text-center text-sm font-bold text-foreground">{copy.shareHeading}</p>
              <ShareButtons language={language} />
            </div>

            <Link
              href="/dashboard"
              className={buttonVariants({ className: "mt-8 h-12 w-full rounded-sm text-base font-bold" })}
            >
              {copy.continueButton}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
