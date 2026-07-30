"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "./actions";

export function SignupForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (!result.ok) {
        setError({ message: result.error.message, recovery: result.error.recovery });
      }
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
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
        {pending ? "Creating your account…" : "Start free trial"}
      </Button>
      <p className="text-center text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  );
}
