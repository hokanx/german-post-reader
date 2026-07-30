import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { LetterList } from "./letter-list";
import { LogoutButton } from "./logout-button";

const TRIAL_LIMIT = 3;

export const metadata = {
  title: "Dashboard",
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
      .select("subscription_status, trial_letters_used")
      .eq("id", user.id)
      .single(),
    supabase
      .from("letters")
      .select("id, summary, deadlines, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const isSubscribed = profile?.subscription_status === "active";
  const trialUsed = profile?.trial_letters_used ?? 0;
  const lettersLeft = Math.max(TRIAL_LIMIT - trialUsed, 0);

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            German Post, translated.
          </Link>
          <LogoutButton />
        </div>

        {isSubscribed ? (
          <div className="mb-6 rounded-md border-2 border-border bg-muted px-5 py-4">
            <span className="rounded-full border-2 border-border bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-primary-foreground">
              Unlimited letters
            </span>
          </div>
        ) : (
          <div className="mb-6 rounded-md border-2 border-border bg-accent px-5 py-4">
            <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-foreground">
              {trialUsed} of {TRIAL_LIMIT} free letters used
            </span>
            {lettersLeft === 0 && (
              <p className="mt-2 text-sm font-medium text-accent-foreground">
                Subscribe to keep analyzing letters.
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
  );
}
