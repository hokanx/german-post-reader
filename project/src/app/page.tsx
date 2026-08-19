import { LocaleProvider } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustCallout } from "@/components/landing/trust-callout";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { DemoPitch } from "@/components/landing/demo-pitch";
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
  const registeredCount = DEMO_MODE ? await countRegisteredUsers(createServiceClient()) : 0;

  return (
    <LocaleProvider initialLocale={language}>
      <ShareSourceTracker src={src} via={via} />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TrustCallout />
        {DEMO_MODE ? (
          <DemoPitch registeredCount={registeredCount} />
        ) : (
          <>
            <ValueStack />
            <Bonuses />
          </>
        )}
        <CtaBand />
      </main>
      <LandingFooter />
    </LocaleProvider>
  );
}
