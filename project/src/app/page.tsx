import { LocaleProvider } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustCallout } from "@/components/landing/trust-callout";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <LocaleProvider>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TrustCallout />
        <ValueStack />
        <Bonuses />
        <CtaBand />
      </main>
      <LandingFooter />
    </LocaleProvider>
  );
}
