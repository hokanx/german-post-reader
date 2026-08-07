import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Upload, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { AppHeader } from "@/components/app-header";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import type { AppLanguage } from "@/lib/letters/types";
import { LetterList } from "./letter-list";
import { ManageSubscriptionLink } from "./manage-subscription-link";
import { PurchaseConfirmationToast } from "./purchase-confirmation-toast";

export const metadata = {
  title: "Dashboard — German Post Letter Reader",
  robots: { index: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: letters }] = await Promise.all([
    supabase
      .from("profiles")
      .select("has_active_subscription, trial_letters_used, language")
      .eq("id", user.id)
      .single(),
    supabase
      .from("letters")
      .select("id, summary, deadlines, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const hasActiveSubscription = profile?.has_active_subscription ?? false;
  const trialUsed = profile?.trial_letters_used ?? 0;
  const lettersLeft = Math.max(FREE_LETTER_LIMIT - trialUsed, 0);

  return (
    <>
      <AppHeader language={(profile?.language ?? "en") as AppLanguage} />
      <main className="flex-1 bg-background">
        <Suspense fallback={null}>
          <PurchaseConfirmationToast />
        </Suspense>
        <div className="mx-auto max-w-3xl px-6 py-8">
          {hasActiveSubscription ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-border bg-muted px-5 py-4">
              <span className="rounded-full border-2 border-border bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-primary-foreground">
                Unlimited letters
              </span>
              <ManageSubscriptionLink />
            </div>
          ) : (
            <div className="mb-6 inline-flex flex-col items-start gap-2 rounded-md border-2 border-border bg-accent px-5 py-4">
              <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-foreground">
                {trialUsed} of {FREE_LETTER_LIMIT} free letters used
              </span>
              {lettersLeft === 0 && (
                <p className="text-sm font-medium text-accent-foreground">
                  Unlock unlimited letters for €5.99/year.
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
            Upload a letter
          </Link>

          <h1 className="mb-4 text-xl font-extrabold tracking-[-0.02em] text-foreground">
            Your letters
          </h1>

          {letters && letters.length > 0 ? (
            <LetterList letters={letters} />
          ) : (
            <EmptyState
              icon={Mail}
              title="No letters yet"
              description="Upload your first German letter to get a plain-language summary, deadlines, and a ready-to-send reply."
              action={{ label: "Upload a letter", href: "/upload" }}
            />
          )}
        </div>
      </main>
    </>
  );
}
