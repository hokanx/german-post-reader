import { MinimalHeader } from "@/components/minimal-header";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { APP_COPY } from "@/lib/i18n/copy";

export const metadata = {
  title: "Privacy Policy — Papkram",
  description: "How we handle your letters and account data.",
};

export default async function PrivacyPage() {
  const language = await getPreAuthLanguage();
  const copy = APP_COPY[language].legal.privacy;

  return (
    <div className="flex flex-1 flex-col">
      <MinimalHeader language={language} />
      <main dir={language === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
          {copy.title}
        </h1>
        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-foreground/80">
          {copy.sections.map((section, i) => (
            <section key={section.heading}>
              <h2 className="font-heading text-lg font-extrabold text-foreground">{section.heading}</h2>
              <p className="mt-2">
                {section.body}
                {i === copy.sections.length - 1 && (
                  <>
                    {" "}
                    <a href="mailto:hello@germanpostreader.app" className="text-primary underline underline-offset-4">
                      hello@germanpostreader.app
                    </a>
                    .
                  </>
                )}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
