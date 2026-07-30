import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Log in — German Post Letter Reader",
  description: "Log in to see your letter history and continue where you left off.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground"
        >
          German Post, translated.
        </Link>
        <div className="rounded-lg border-2 border-border bg-card p-8 shadow-[4px_4px_0_0_var(--border)]">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Log in to see your letter history.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
