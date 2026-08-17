import { Skeleton } from "@/components/ui/skeleton";

export default function UploadLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-80" />
        </div>
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    </main>
  );
}
