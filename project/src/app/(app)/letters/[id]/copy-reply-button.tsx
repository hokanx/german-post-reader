"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AppCopy } from "@/lib/i18n/copy";

export function CopyReplyButton({ text, copy }: { text: string; copy: AppCopy["letters"] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(copy.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copy.copyFailedToast);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      className="h-10 rounded-sm border-2 border-border text-sm font-bold"
    >
      {copied ? (
        <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
      )}
      {copied ? copy.copied : copy.copyReply}
    </Button>
  );
}
