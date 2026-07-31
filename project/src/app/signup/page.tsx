import Link from "next/link";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import { SignupForm } from "./signup-form";

export const metadata = {
  title: "Start your free trial — German Post Letter Reader",
  description: "Create an account and analyze your first German letter free — no card required.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-full flex-1 items-start justify-center bg-background px-6 py-12 sm:items-center sm:py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground"
        >
          German Post, translated.
        </Link>
        <div className="rounded-lg border-2 border-border bg-card p-8 shadow-[4px_4px_0_0_var(--border)]">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {FREE_LETTER_LIMIT} letters free, no card needed
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Create an account to start reading your German post in plain
            language.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </main>
  );
}
