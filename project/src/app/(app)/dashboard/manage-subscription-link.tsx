"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { AppCopy } from "@/lib/i18n/copy";

export function ManageSubscriptionLink({ copy }: { copy: AppCopy["dashboard"] }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/portal", { method: "POST" });
        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? copy.portalError);
        }
        window.location.href = data.url;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : copy.portalError);
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
      {pending ? copy.openingPortal : copy.manageSubscription}
    </button>
  );
}
