import { MinimalHeader } from "@/components/minimal-header";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";

export const metadata = {
  title: "Impressum — Papkram",
  description: "Legal notice per §5 DDG.",
  robots: { index: false },
};

/**
 * NOT LINKED from nav/footer yet, and NOT launch-ready — every bracketed
 * field below is a placeholder (same convention the app already uses for
 * reply-draft letterheads before sender info is set). This page cannot be
 * real until Papkram has a registered legal entity behind it; fill in every
 * bracket, then wire it into LandingFooter / MinimalHeader before launch.
 * Deliberately NOT run through the app's EN/AR/TR i18n system — an
 * Impressum is a legal filing, not user-facing product copy, and German
 * sites conventionally keep it under this exact title regardless of the
 * site's operating language.
 */
export default async function ImpressumPage() {
  const language = await getPreAuthLanguage();

  return (
    <div className="flex flex-1 flex-col">
      <MinimalHeader language={language} />
      <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">Impressum</h1>
        <p className="mt-2 text-sm text-foreground/60">Angaben gemäß §5 DDG</p>

        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Operator</h2>
            <p className="mt-2">
              [Operator legal name — your full name if a sole proprietor, or the registered company name]
              <br />
              [Street address — a real address, not a P.O. box]
              <br />
              [Postal code, city]
              <br />
              [Country]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Contact</h2>
            <p className="mt-2">
              Email: [operator email]
              <br />
              Phone: [a phone number or other fast electronic contact — required, not optional]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Register entry</h2>
            <p className="mt-2">
              [If a registered company: Handelsregister court + registration number. If a sole proprietor with no
              register entry, delete this section entirely.]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">VAT ID</h2>
            <p className="mt-2">
              [USt-IdNr., if VAT-registered. If operating under §19 UStG (Kleinunternehmerregelung), state that
              instead: &ldquo;Gemäß §19 UStG wird keine Umsatzsteuer berechnet.&rdquo;]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Responsible for content</h2>
            <p className="mt-2">[Name of the person responsible for content per §18 MStV — usually the operator.]</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Dispute resolution</h2>
            <p className="mt-2">
              The European Commission provides a platform for online dispute resolution (OS):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                className="text-primary underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              . We are [not / are — pick one] willing to participate in dispute resolution proceedings before a
              consumer arbitration board.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
