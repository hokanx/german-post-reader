"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export function ManageSubscriptionLink() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/portal", { method: "POST" });
        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Couldn't open the billing portal.");
        }
        window.location.href = data.url;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't open the billing portal.");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="text-xs font-medium text-primary underline underline-offset-4 disabled:opacity-60"
    >
      {pending ? "Opening…" : "Manage subscription"}
    </button>
  );
}
