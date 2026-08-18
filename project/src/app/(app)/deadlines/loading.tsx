import { Skeleton } from "@/components/ui/skeleton";

export default function DeadlinesLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="mb-4 h-7 w-40" />
        <div className="rounded-md border-2 border-border bg-card p-4 shadow-[4px_4px_0_0_var(--border)] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="size-9 rounded-full" />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 42 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
