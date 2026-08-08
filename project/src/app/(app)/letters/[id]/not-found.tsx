import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function LetterNotFound() {
  return (
    <main className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16">
      <EmptyState
        icon={FileQuestion}
        title="We can't find that letter"
        description="It may have been removed, or the link doesn't belong to your account."
        action={{ label: "Back to dashboard", href: "/dashboard" }}
      />
    </main>
  );
}
