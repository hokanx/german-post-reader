"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { SUBSCRIPTION_PRICE_EUR, SUBSCRIPTION_PRICE_MONTHLY_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

/**
 * The Settings page's free-trial "Subscription" section previously had no
 * action at all — a dead end for exactly the users who need to convert.
 * This mirrors ManageSubscriptionLink's pattern but hits the checkout
 * endpoint instead of the billing portal. The checkbox is what actually
 * makes the Widerrufsrecht early-access waiver in the Terms effective —
 * §356(5)/§357(8) BGB require an explicit request at the time of order,
 * not just terms text the customer may never have read.
 *
 * Takes just `language` (not a pre-built copy object) and looks up its own
 * copy client-side, same as PaywallModal — copy.subscribe is a function,
 * and functions can't cross the server→client props boundary from the
 * (server-component) settings page.
 */
export function SettingsUpgradeButton({ language }: { language: AppLanguage }) {
  const copy = APP_COPY[language].paywall;
  const [pending, startTransition] = useTransition();
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");

  const interval = plan === "yearly" ? "year" : "month";
  const price = formatEur(plan === "yearly" ? SUBSCRIPTION_PRICE_EUR : SUBSCRIPTION_PRICE_MONTHLY_EUR);

  function handleClick() {
    if (!consented) {
      setError(copy.earlyAccessConsentRequired);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
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
    <div className="grid max-w-xs gap-3">
      <div
        role="radiogroup"
        aria-label={copy.planToggle.yearly}
        className="grid grid-cols-2 gap-2 rounded-sm border-2 border-border bg-muted p-1"
      >
        {(["yearly", "monthly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={plan === option}
            onClick={() => setPlan(option)}
            className={`h-10 rounded-sm text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              plan === option ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {option === "yearly" ? copy.planToggle.yearly : copy.planToggle.monthly}
          </button>
        ))}
      </div>

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
        {pending ? copy.redirecting : copy.subscribe(price, interval)}
      </button>
    </div>
  );
}
