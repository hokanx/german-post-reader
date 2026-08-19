"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { cn } from "@/lib/utils";
import { deleteAccount } from "@/app/(app)/settings/delete-account-action";

const CONFIRM_WORD = "DELETE";

export function DeleteAccountDialog({ language = "en" }: { language?: AppLanguage }) {
  const copy = APP_COPY[language].settings;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmText("");
      setError(null);
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount(language);
      if (!result.ok) {
        setError({ message: result.error.message, recovery: result.error.recovery });
        return;
      }
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (error) {
        console.error("deleteAccount: client-side signOut failed", error);
      }
      toast.success(copy.deleteAccountSuccessToast);
      router.push("/");
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "h-11 gap-2 rounded-sm border-2 border-destructive/40 px-4 text-sm font-medium",
        )}
      >
        <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {copy.deleteAccountButton}
      </DialogTrigger>
      <DialogContent
        dir={language === "ar" ? "rtl" : "ltr"}
        className="rounded-md border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)] sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.deleteAccountTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/70">{copy.deleteAccountWarning}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label htmlFor="confirm-delete" className="text-sm font-medium text-foreground">
            {copy.deleteAccountConfirmLabel}
          </label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoComplete="off"
            className="h-12 rounded-sm border-2 border-border text-base"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error.message}
            {error.recovery && ` ${error.recovery}`}
          </p>
        )}

        <Button
          type="button"
          disabled={pending || confirmText !== CONFIRM_WORD}
          onClick={handleDelete}
          variant="destructive"
          className="h-12 w-full rounded-sm text-base font-bold"
        >
          {pending ? copy.deleteAccountDeleting : copy.deleteAccountConfirmCta}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
