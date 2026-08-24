import { LocaleProvider } from "@/components/landing/locale-context";
import type { MarketingLocale } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { WhatIsPapkram } from "@/components/landing/what-is-papkram";
import { TrustBadgeStrip } from "@/components/landing/trust-badge-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PrivacySection } from "@/components/landing/privacy-section";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { FaqSection } from "@/components/landing/faq-section";
import { PassItOn } from "@/components/landing/pass-it-on";
import { ShareSourceTracker } from "@/components/landing/share-source-tracker";
import { CtaBand } from "@/components/landing/cta-band";
import { FloatingCta } from "@/components/landing/floating-cta";
import { LandingFooter } from "@/components/landing/footer";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { DEMO_MODE } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { countRegisteredUsers } from "@/lib/profile/count-registered";

const VALID_LOCALES: readonly MarketingLocale[] = ["en", "ar", "tr"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; via?: string; lang?: string }>;
}) {
  const cookieLanguage = await getPreAuthLanguage();
  const { src, via, lang } = await searchParams;

  // A share link (`?lang=...`) carries the sharer's own language, so the
  // page opens in that language even for a visitor with no marketing_locale
  // cookie of their own yet — takes priority over the cookie default.
  const sharedLocale = VALID_LOCALES.includes(lang as MarketingLocale) ? (lang as MarketingLocale) : null;
  const language = sharedLocale ?? cookieLanguage;

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
      <ShareSourceTracker src={src} via={via} sharedLocale={sharedLocale} />
      <LandingNav />
      <main className="flex-1">
        <Hero registeredCount={registeredCount} />
        <WhatIsPapkram />
        <TrustBadgeStrip />
        <HowItWorks />
        <PrivacySection />
        {!DEMO_MODE && (
          <>
            <ValueStack />
            <Bonuses />
          </>
        )}
        <FaqSection />
        <PassItOn />
        <CtaBand registeredCount={registeredCount} />
      </main>
      <LandingFooter />
      <FloatingCta />
    </LocaleProvider>
  );
}
