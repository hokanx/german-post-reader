import { Skeleton } from "@/components/ui/skeleton";

export default function DeadlinesLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="mb-4 h-7 w-40" />
        <div className="grid gap-3">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
