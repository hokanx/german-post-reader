"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export function DemoLimitModal({
  open,
  onOpenChange,
  language = "en",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: AppLanguage;
}) {
  const copy = APP_COPY[language].demoLimit;
  const router = useRouter();

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
          <DialogDescription className="text-sm text-foreground/70">{copy.body}</DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="h-12 w-full rounded-sm text-base font-bold"
        >
          {copy.backToDashboard}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
