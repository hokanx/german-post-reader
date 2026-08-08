import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { APP_COPY } from "@/lib/i18n/copy";
import { LanguagePicker } from "./language-picker";

export const metadata = {
  title: "Choose your language — Papkram",
  description: "Pick the language your letter summaries and replies are written in.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("language")
    .eq("id", user.id)
    .single();

  if (profile?.language) {
    redirect("/dashboard");
  }

  const language = await getPreAuthLanguage();
  const copy = APP_COPY[language].onboarding;

  return (
    <>
      <AppHeader />
      <main dir={language === "ar" ? "rtl" : "ltr"} className="flex flex-1 flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {copy.heading}
              </h1>
              <p className="mt-3 text-base text-foreground/80">{copy.subhead}</p>
            </div>
            <LanguagePicker copy={copy} uiLanguage={language} />
          </div>
        </div>
      </main>
    </>
  );
}
