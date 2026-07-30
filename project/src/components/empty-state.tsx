import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-md border-2 border-border bg-card px-8 py-14 text-center shadow-[4px_4px_0_0_var(--border)]">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full border-2 border-border bg-muted">
        <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-foreground/70">{description}</p>
      {action && (
        <Link
          href={action.href}
          className={buttonVariants({ className: "mt-6 h-11 rounded-sm font-bold" })}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
