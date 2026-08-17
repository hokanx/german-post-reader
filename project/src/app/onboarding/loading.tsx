import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/app-header";

export default function OnboardingLoading() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">
            <div className="mb-10 text-center">
              <Skeleton className="mx-auto h-10 w-72" />
              <Skeleton className="mx-auto mt-3 h-5 w-56" />
            </div>
            <div className="grid gap-3">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
