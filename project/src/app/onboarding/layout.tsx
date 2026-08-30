import { AppHeader } from "@/components/app-header";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";

/** Onboarding has no shared route-group layout like (app)/, so page/loading/error each need the header — centralized here so all three get the right language/dir instead of silently defaulting to English/LTR. */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const language = await getPreAuthLanguage();

  return (
    <>
      <AppHeader language={language} />
      {children}
    </>
  );
}
