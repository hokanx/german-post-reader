"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import type { AppLanguage } from "@/lib/letters/types";

const LOGOUT_LABEL: Record<AppLanguage, string> = {
  en: "Log out",
  ar: "تسجيل الخروج",
  tr: "Çıkış yap",
};

export function LogoutButton({ language = "en" }: { language?: AppLanguage }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
    >
      <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
      {LOGOUT_LABEL[language]}
    </button>
  );
}
