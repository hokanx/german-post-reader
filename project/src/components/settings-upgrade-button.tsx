"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

/** Only the string fields this component actually renders — see manage-subscription-link.tsx for why callers pass a narrowed object rather than the whole paywall copy (which also carries function-valued entries like `heading`/`description`). */
type SettingsUpgradeCopy = {
  subscribe: string;
  redirecting: string;
  checkoutError: string;
  earlyAccessConsent: string;
  earlyAccessConsentRequired: string;
};

/**
 * The Settings page's free-trial "Subscription" section previously had no
 * action at all — a dead end for exactly the users who need to convert.
 * This mirrors ManageSubscriptionLink's pattern but hits the checkout
 * endpoint instead of the billing portal. The checkbox is what actually
 * makes the Widerrufsrecht early-access waiver in the Terms effective —
 * §356(5)/§357(8) BGB require an explicit request at the time of order,
 * not just terms text the customer may never have read.
 */
export function SettingsUpgradeButton({ copy }: { copy: SettingsUpgradeCopy }) {
  const [pending, startTransition] = useTransition();
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!consented) {
      setError(copy.earlyAccessConsentRequired);
      return;
    }
    setError(null);
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
    <div className="grid gap-3">
      <label className="flex items-start gap-2.5 text-sm text-foreground/80">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => {
            setConsented(e.target.checked);
            if (e.target.checked) setError(null);
          }}
          className="mt-0.5 size-4 shrink-0 rounded-sm border-2 border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {copy.earlyAccessConsent}
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={handleClick}
        className="flex h-11 w-fit items-center gap-2 rounded-sm border-2 border-border bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {pending ? copy.redirecting : copy.subscribe}
      </button>
    </div>
  );
}
