import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LanguagePicker } from "./language-picker";

export const metadata = {
  title: "Choose your language — German Post Letter Reader",
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

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            What language works for you?
          </h1>
          <p className="mt-3 text-base text-foreground/80">
            Every summary, deadline, and reply draft will be written in this
            language. You can switch it any time from your dashboard.
          </p>
        </div>
        <LanguagePicker />
      </div>
    </main>
  );
}
