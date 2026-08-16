import { Suspense } from "react";
import Link from "next/link";
import { Upload, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { LetterList } from "./letter-list";
import { ManageSubscriptionLink } from "@/components/manage-subscription-link";
import { PurchaseConfirmationToast } from "./purchase-confirmation-toast";
import { NextUpCard } from "./next-up-card";

export const metadata = {
  title: "Dashboard — Papkram",
  robots: { index: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { data: letters }] = await Promise.all([
    supabase
      .from("profiles")
      .select("has_active_subscription, trial_letters_used, language")
      .eq("id", user.id)
      .single(),
    supabase
      .from("letters")
      .select("id, summary, deadlines, action_required, created_at, language")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const hasActiveSubscription = profile?.has_active_subscription ?? false;
  const trialUsed = profile?.trial_letters_used ?? 0;
  const lettersLeft = Math.max(FREE_LETTER_LIMIT - trialUsed, 0);
  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  type Deadline = { date: string; description: string };
  const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const todayIso = new Date().toISOString().slice(0, 10);
  const nextUp = (letters ?? [])
    .flatMap((letter) =>
      (letter.deadlines as Deadline[] | null ?? []).map((d) => ({
        ...d,
        letterId: letter.id,
        contentLanguage: letter.language as AppLanguage,
      })),
    )
    .filter((d) => ISO_DATE_RE.test(d.date) && d.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <main dir={dir} className="flex-1 bg-background">
        <Suspense fallback={null}>
          <PurchaseConfirmationToast message={copy.dashboard.subscriptionActiveToast} />
        </Suspense>
        <div className="mx-auto max-w-3xl px-6 py-8">
          {hasActiveSubscription ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-border bg-muted px-5 py-4">
              <span className="rounded-full border-2 border-border bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-primary-foreground">
                {copy.dashboard.unlimitedBadge}
              </span>
              <ManageSubscriptionLink
                copy={{
                  manageSubscription: copy.dashboard.manageSubscription,
                  openingPortal: copy.dashboard.openingPortal,
                  portalError: copy.dashboard.portalError,
                }}
              />
            </div>
          ) : (
            <div className="mb-6 inline-flex flex-col items-start gap-2 rounded-md border-2 border-border bg-accent px-5 py-4">
              <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-foreground">
                {copy.dashboard.lettersUsed(trialUsed, FREE_LETTER_LIMIT)}
              </span>
              {lettersLeft === 0 && (
                <p className="text-sm font-medium text-accent-foreground">
                  {copy.dashboard.unlockCta(formatEur(SUBSCRIPTION_PRICE_EUR))}
                </p>
              )}
            </div>
          )}

          <Link
            href="/upload"
            className={buttonVariants({
              className: "mb-8 h-14 w-full rounded-md text-base font-bold",
            })}
          >
            <Upload className="size-5" strokeWidth={1.5} aria-hidden="true" />
            {copy.dashboard.uploadButton}
          </Link>

          {nextUp && (
            <NextUpCard
              letterId={nextUp.letterId}
              description={nextUp.description}
              date={nextUp.date}
              language={language}
              contentLanguage={nextUp.contentLanguage}
              heading={copy.dashboard.nextUpHeading}
            />
          )}

          <h1 className="mb-4 text-xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.dashboard.yourLetters}
          </h1>

          {letters && letters.length > 0 ? (
            <LetterList letters={letters} language={language} />
          ) : (
            <EmptyState
              icon={Mail}
              title={copy.dashboard.emptyTitle}
              description={copy.dashboard.emptyDescription}
              action={{ label: copy.dashboard.uploadButton, href: "/upload" }}
            />
          )}
        </div>
      </main>
  );
}
