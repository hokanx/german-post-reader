import { Skeleton } from "@/components/ui/skeleton";

export default function LetterLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
            <Skeleton className="h-5 w-28" />
            <div className="mt-3 flex items-center gap-2.5">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-3 grid gap-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-2/3" />
            </div>
            <div className="mt-4 border-t-2 border-border pt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2.5 h-11 w-full rounded-sm" />
            </div>
            <div className="mt-4 border-t-2 border-border pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2.5 h-11 w-full rounded-sm" />
            </div>
          </div>

          <div className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 grid gap-4">
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>

          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-52 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
