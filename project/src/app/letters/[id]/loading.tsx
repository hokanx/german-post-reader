import { Skeleton } from "@/components/ui/skeleton";

export default function LetterLoading() {
  return (
    <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
        <Skeleton className="h-32 w-full rounded-md" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    </main>
  );
}
