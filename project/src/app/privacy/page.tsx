export const metadata = {
  title: "Privacy Policy — German Post Letter Reader",
  description: "How we handle your letters and account data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        Privacy Policy
      </h1>
      <div className="mt-8 grid gap-6 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="font-heading text-lg font-extrabold text-foreground">What we store</h2>
          <p className="mt-2">
            When you upload a letter, we store the original image or PDF, the
            analysis we generate from it (summary, deadlines, reply draft,
            risk flags), and the language you chose. This is stored in a
            private storage bucket and database rows tied to your account —
            only you can access your own letters.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            How your letter is processed
          </h2>
          <p className="mt-2">
            The contents of an uploaded letter are sent to Google&apos;s
            Gemini API to generate the analysis. We do not use your letters to
            train any model. We never display the raw extracted text back to
            you or anyone else — only the structured summary, deadlines, and
            reply draft.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-extrabold text-foreground">Payments</h2>
          <p className="mt-2">
            Subscription billing is handled by Stripe. We never see or store
            your card details — Stripe processes and stores that directly.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-extrabold text-foreground">Your rights</h2>
          <p className="mt-2">
            You can request deletion of your account and all associated
            letters at any time by contacting{" "}
            <a href="mailto:hello@germanpostreader.app" className="text-primary underline underline-offset-4">
              hello@germanpostreader.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
