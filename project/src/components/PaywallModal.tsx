"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR, SUBSCRIPTION_PRICE_MONTHLY_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export function PaywallModal({
  open,
  onOpenChange,
  language = "en",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: AppLanguage;
}) {
  const copy = APP_COPY[language].paywall;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");

  const interval = plan === "yearly" ? "year" : "month";
  const price = formatEur(plan === "yearly" ? SUBSCRIPTION_PRICE_EUR : SUBSCRIPTION_PRICE_MONTHLY_EUR);

  function handleSubscribe() {
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
        const message = err instanceof Error ? err.message : copy.checkoutError;
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={language === "ar" ? "rtl" : "ltr"}
        className="rounded-md border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)] sm:max-w-md"
      >
        <DialogHeader>
          <span className="w-fit rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.badge}
          </span>
          <DialogTitle className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.heading(FREE_LETTER_LIMIT)}
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/70">
            {copy.description(price, interval)}
          </DialogDescription>
        </DialogHeader>

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
                plan === option
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground"
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

        <Button
          type="button"
          disabled={pending}
          onClick={handleSubscribe}
          className="h-12 w-full rounded-sm text-base font-bold"
        >
          {pending ? copy.redirecting : copy.subscribe(price, interval)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
