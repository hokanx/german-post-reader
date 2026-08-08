import { createClient } from "@/lib/supabase/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutButton } from "@/components/logout-button";
import { ManageSubscriptionLink } from "@/components/manage-subscription-link";
import { SettingsUpgradeButton } from "@/components/settings-upgrade-button";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";

export const metadata = {
  title: "Settings — Papkram",
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("language, has_active_subscription")
    .eq("id", user.id)
    .single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const hasActiveSubscription = profile?.has_active_subscription ?? false;
  const copy = APP_COPY[language].settings;
  const dashboardCopy = APP_COPY[language].dashboard;
  const paywallCopy = APP_COPY[language].paywall;
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-6 text-xl font-extrabold tracking-[-0.02em] text-foreground">{copy.heading}</h1>

        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.languageHeading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">{copy.languageDescription}</p>
          <div className="mt-4">
            <LanguageSwitcher current={language} />
          </div>
        </section>

        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.subscriptionHeading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            {hasActiveSubscription ? copy.subscriptionActive : copy.subscriptionFree}
          </p>
          <div className="mt-4">
            {hasActiveSubscription ? (
              <ManageSubscriptionLink
                copy={{
                  manageSubscription: dashboardCopy.manageSubscription,
                  openingPortal: dashboardCopy.openingPortal,
                  portalError: dashboardCopy.portalError,
                }}
              />
            ) : (
              <SettingsUpgradeButton
                copy={{
                  subscribe: paywallCopy.subscribe(formatEur(SUBSCRIPTION_PRICE_EUR)),
                  redirecting: paywallCopy.redirecting,
                  checkoutError: paywallCopy.checkoutError,
                }}
              />
            )}
          </div>
        </section>

        <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.accountHeading}
          </h2>
          <div className="mt-4">
            <LogoutButton language={language} />
          </div>
        </section>
      </div>
    </main>
  );
}
