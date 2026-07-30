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

export function PaywallModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubscribe() {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Couldn't start checkout.");
        }
        window.location.href = data.url;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Couldn't start checkout.";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-md border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)] sm:max-w-md">
        <DialogHeader>
          <span className="w-fit rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            Free trial ended
          </span>
          <DialogTitle className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            You&apos;ve used all 3 free letters
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/70">
            Subscribe for €9.99/month to keep analyzing letters — unlimited
            summaries, deadlines, and reply drafts.
          </DialogDescription>
        </DialogHeader>

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
          {pending ? "Redirecting…" : "Subscribe Now"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
