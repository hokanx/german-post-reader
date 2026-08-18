import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string } | { label: string; onClick: () => void };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-md border-2 border-border bg-card px-8 py-14 text-center shadow-[4px_4px_0_0_var(--border)]">
      <div className="mb-5 flex size-16 rotate-[-3deg] items-center justify-center rounded-md border-2 border-border bg-accent shadow-[3px_3px_0_0_var(--border)]">
        <Icon className="size-5 text-accent-foreground" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-foreground/70">{description}</p>
      {action && "href" in action && (
        <Link
          href={action.href}
          className={buttonVariants({ className: "mt-6 h-11 rounded-sm font-bold" })}
        >
          {action.label}
        </Link>
      )}
      {action && "onClick" in action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-6 h-11 rounded-sm border-2 border-border font-bold",
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
