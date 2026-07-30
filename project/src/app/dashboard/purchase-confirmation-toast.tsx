"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Checkout's success_url set `?purchased=true` but nothing ever read it — a
 * user landing back on the dashboard after paying got no confirmation at
 * all. Reads it once, shows a toast, then strips the param.
 */
export function PurchaseConfirmationToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("purchased") === "true") {
      toast.success("Unlimited access unlocked — thanks for the support!");
      router.replace("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
