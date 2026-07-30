import { MinimalHeader } from "@/components/minimal-header";
import { FREE_LETTER_LIMIT, UNLIMITED_PRICE_EUR } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service — German Post Letter Reader",
  description: "The terms for using German Post Letter Reader.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MinimalHeader />
      <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
          Terms of Service
        </h1>
        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">
              What this service is
            </h2>
            <p className="mt-2">
              German Post Letter Reader analyzes German-language postal letters
              and produces a plain-language summary, deadline detection, and a
              draft reply. It is a reading and drafting aid, not legal, tax, or
              financial advice.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">
              Accuracy isn&apos;t guaranteed
            </h2>
            <p className="mt-2">
              AI analysis can misread amounts, dates, or context, especially
              from low-quality photos. When we&apos;re not confident, we flag it
              — but always double-check anything involving money, legal
              deadlines, or official obligations before acting on it.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Free trial and billing</h2>
            <p className="mt-2">
              New accounts get {FREE_LETTER_LIMIT} free letter analyses, no card
              required. Beyond that, a one-time payment of €{UNLIMITED_PRICE_EUR}{" "}
              unlocks unlimited analyses for your account — there is no
              subscription and no recurring charge.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-extrabold text-foreground">Account termination</h2>
            <p className="mt-2">
              You can delete your account at any time. We may suspend accounts
              used to abuse the service (e.g. uploading non-letter content at
              scale).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
