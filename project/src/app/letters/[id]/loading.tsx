import { Skeleton } from "@/components/ui/skeleton";

export default function LetterLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="border-b-2 border-border bg-background px-6 py-4">
        <Skeleton className="mx-auto h-6 w-48 max-w-3xl" />
      </div>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
