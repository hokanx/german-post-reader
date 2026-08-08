import { MinimalHeader } from "@/components/minimal-header";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { APP_COPY } from "@/lib/i18n/copy";

export const metadata = {
  title: "Terms of Service — Papkram",
  description: "The terms for using Papkram.",
};

export default async function TermsPage() {
  const language = await getPreAuthLanguage();
  const copy = APP_COPY[language].legal.terms;

  return (
    <div className="flex flex-1 flex-col">
      <MinimalHeader language={language} />
      <main dir={language === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
          {copy.title}
        </h1>
        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-foreground/80">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-lg font-extrabold text-foreground">{section.heading}</h2>
              <p className="mt-2">{section.body(FREE_LETTER_LIMIT, formatEur(SUBSCRIPTION_PRICE_EUR))}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
