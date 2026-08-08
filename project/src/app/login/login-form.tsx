"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { login } from "./actions";

export function LoginForm({ language }: { language: AppLanguage }) {
  const copy = APP_COPY[language].auth;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData, language);
      if (!result.ok) {
        setError({ message: result.error.message, recovery: result.error.recovery });
      }
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">{copy.emailLabel}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded-sm border-2 border-border text-base"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{copy.passwordLabel}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 rounded-sm border-2 border-border text-base"
        />
      </div>
      {error && (
        <div
          role="alert"
          className="rounded-sm border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-foreground"
        >
          <p className="font-medium">{error.message}</p>
          {error.recovery && <p className="mt-1 text-foreground/70">{error.recovery}</p>}
        </div>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="h-12 rounded-sm text-base font-bold"
      >
        {pending ? copy.login.submitting : copy.login.submit}
      </Button>
      <p className="text-center text-sm text-foreground/70">
        {copy.login.noAccount}{" "}
        <Link href="/signup" className="font-medium text-primary underline underline-offset-4">
          {copy.login.startTrialLink}
        </Link>
      </p>
    </form>
  );
}
