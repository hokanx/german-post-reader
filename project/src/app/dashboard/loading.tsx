import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-11 w-24 rounded-sm" />
        </div>
        <Skeleton className="mb-6 h-16 w-full rounded-md" />
        <Skeleton className="mb-8 h-14 w-full rounded-md" />
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid gap-3">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
