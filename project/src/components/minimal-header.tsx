import Link from "next/link";

/** Logo-only header for logged-out static pages (privacy, terms) that previously had no way to navigate anywhere else. */
export function MinimalHeader() {
  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-4">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
          German Post, translated.
        </Link>
      </div>
    </header>
  );
}
