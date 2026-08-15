import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";
import type { AppLanguage } from "@/lib/letters/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("language").eq("id", user.id).single();
  const language = (profile?.language ?? "en") as AppLanguage;

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <>
      <AppHeader language={language} />
      <div
        dir={dir}
        className="flex flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] sm:flex-row sm:pb-0"
      >
        <AppNav language={language} />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </>
  );
}
