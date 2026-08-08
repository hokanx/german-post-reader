"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** Reads checkout's `?subscribed=true` success param once, shows a confirmation toast, then strips it. */
export function PurchaseConfirmationToast({ message }: { message: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      toast.success(message);
      router.replace("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
