"use client";

import { useTransition } from "react";
import { toast } from "sonner";

/** Only the string fields this component actually renders — see manage-subscription-link.tsx for why callers pass a narrowed object rather than the whole paywall copy (which also carries function-valued entries like `heading`/`description`). */
type SettingsUpgradeCopy = {
  subscribe: string;
  redirecting: string;
  checkoutError: string;
};

/**
 * The Settings page's free-trial "Subscription" section previously had no
 * action at all — a dead end for exactly the users who need to convert.
 * This mirrors ManageSubscriptionLink's pattern but hits the checkout
 * endpoint instead of the billing portal.
 */
export function SettingsUpgradeButton({ copy }: { copy: SettingsUpgradeCopy }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? copy.checkoutError);
        }
        window.location.href = data.url;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : copy.checkoutError);
      }
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
    >
      {pending ? copy.redirecting : copy.subscribe}
    </button>
  );
}
