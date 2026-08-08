import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="mb-6 h-7 w-32" />
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
