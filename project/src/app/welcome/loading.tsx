import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomeLoading() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto mt-3 h-5 w-64" />
          <Skeleton className="mx-auto mt-10 h-56 w-full rounded-md" />
          <Skeleton className="mx-auto mt-8 h-12 w-full rounded-sm" />
        </div>
      </div>
    </main>
  );
}
