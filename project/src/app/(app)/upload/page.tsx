import { createClient } from "@/lib/supabase/server";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { UploadForm } from "./upload-form";

// The upload action runs client-side compression, a Gemini document call, a
// Storage upload and three DB writes inside ONE serverless invocation. A clean
// Gemini call was measured at 11.3s, and the retry ladder (3 delays on
// 429/500/503) can push the worst case to ~50s.
//
// maxDuration was declared nowhere, so this ran on the platform default — at
// or below the clean-path time. When it times out the user does NOT get the
// localized "Analysis failed — try again" state this action carefully builds;
// they get a raw platform 504, which is the worst possible failure for someone
// holding a Behörde letter they cannot read.
//
// 60s is the ceiling on Vercel's Hobby plan and well within Pro's.
export const maxDuration = 60;


export const metadata = {
  title: "Upload a letter — Papkram",
  description: "Upload a photo or PDF of your German letter for a plain-language analysis.",
};

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("language")
    .eq("id", user.id)
    .single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} className="flex-1 bg-background">
        <div className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
              {copy.upload.heading}
            </h1>
            <p className="mt-2 text-base text-foreground/70">{copy.upload.subhead}</p>
          </div>
          <UploadForm language={language} />
        </div>
      </main>
  );
}
