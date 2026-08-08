"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { AppCopy } from "@/lib/i18n/copy";

/**
 * Only the string fields this component actually renders. AppCopy["dashboard"]
 * also carries function-valued entries (lettersUsed, unlockCta) that render
 * other dashboard copy — those can't cross the Server->Client boundary as
 * props, so callers must pass a narrowed object, not the whole dashboard copy.
 */
type ManageSubscriptionCopy = Pick<AppCopy["dashboard"], "manageSubscription" | "openingPortal" | "portalError">;

export function ManageSubscriptionLink({ copy }: { copy: ManageSubscriptionCopy }) {
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
      className="flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
    >
      {pending ? copy.openingPortal : copy.manageSubscription}
    </button>
  );
}
