import { LocaleProvider } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RealLetterCompare } from "@/components/landing/real-letter-compare";
import { PrivacySection } from "@/components/landing/privacy-section";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { DemoPitch } from "@/components/landing/demo-pitch";
import { FaqSection } from "@/components/landing/faq-section";
import { PassItOn } from "@/components/landing/pass-it-on";
import { ShareSourceTracker } from "@/components/landing/share-source-tracker";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/footer";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { DEMO_MODE } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { countRegisteredUsers } from "@/lib/profile/count-registered";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; via?: string }>;
}) {
  const language = await getPreAuthLanguage();
  const { src, via } = await searchParams;

  // Absence of a count (query failure, or createServiceClient() throwing —
  // e.g. SUPABASE_SERVICE_ROLE_KEY unset) must render as "no counter shown",
  // never as a false "0 people signed up" social-proof claim.
  let registeredCount: number | null = null;
  if (DEMO_MODE) {
    try {
      const result = await countRegisteredUsers(createServiceClient());
      if (result.ok) {
        registeredCount = result.data;
      } else {
        console.error("countRegisteredUsers failed", result.error);
      }
    } catch (error) {
      console.error("countRegisteredUsers threw", error);
    }
  }

  return (
    <LocaleProvider initialLocale={language}>
      <ShareSourceTracker src={src} via={via} />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <RealLetterCompare />
        <PrivacySection />
        {DEMO_MODE ? (
          <DemoPitch registeredCount={registeredCount} />
        ) : (
          <>
            <ValueStack />
            <Bonuses />
          </>
        )}
        <FaqSection />
        <PassItOn />
        <CtaBand />
      </main>
      <LandingFooter />
    </LocaleProvider>
  );
}
