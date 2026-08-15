"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { updateSenderInfo } from "@/lib/profile/actions";

export function SenderInfoForm({
  language,
  initialFullName,
  initialPostalAddress,
}: {
  language: AppLanguage;
  initialFullName: string;
  initialPostalAddress: string;
}) {
  const copy = APP_COPY[language].settings;
  const [fullName, setFullName] = useState(initialFullName);
  const [postalAddress, setPostalAddress] = useState(initialPostalAddress);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateSenderInfo(fullName, postalAddress, language);
      if (!result.ok) {
        toast.error(result.error.message, { description: result.error.recovery });
        return;
      }
      toast.success(copy.senderInfoSavedToast);
    });
  }

  return (
    <div className="grid gap-4">
      <div>
        <label htmlFor="full-name" className="text-sm font-bold text-foreground">
          {copy.fullNameLabel}
        </label>
        <Input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1.5 h-12 rounded-sm border-2 border-border text-base"
        />
      </div>
      <div>
        <label htmlFor="postal-address" className="text-sm font-bold text-foreground">
          {copy.postalAddressLabel}
        </label>
        <textarea
          id="postal-address"
          value={postalAddress}
          onChange={(e) => setPostalAddress(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-sm border-2 border-border bg-transparent px-4 py-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={pending}
        className="h-11 w-fit rounded-sm text-sm font-bold"
      >
        {pending ? copy.saving : copy.saveButton}
      </Button>
    </div>
  );
}
