import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import type { AppLanguage } from "@/lib/letters/types";
import { UploadForm } from "./upload-form";

export const metadata = {
  title: "Upload a letter — German Post Letter Reader",
  description: "Upload a photo or PDF of your German letter for a plain-language analysis.",
};

export default async function UploadPage() {
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

  return (
    <>
      <AppHeader language={(profile?.language ?? "en") as AppLanguage} backHref="/dashboard" />
      <main className="flex-1 bg-background">
        <div className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
              Upload a letter
            </h1>
            <p className="mt-2 text-base text-foreground/70">
              A photo or a PDF both work. We&apos;ll read it and come back with a
              plain-language summary, any deadlines, and a ready-to-send reply.
            </p>
          </div>
          <UploadForm />
        </div>
      </main>
    </>
  );
}
