"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyReplyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Reply copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select and copy the text manually.");
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
      {copied ? "Copied" : "Copy reply"}
    </Button>
  );
}
