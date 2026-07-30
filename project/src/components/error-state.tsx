import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  message: string;
  recovery?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ message, recovery, onRetry, retryLabel = "Try again" }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-md border-2 border-destructive bg-destructive/10 px-8 py-14 text-center"
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full border-2 border-destructive bg-card">
        <TriangleAlert className="size-5 text-destructive" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
        {message}
      </h2>
      {recovery && <p className="mt-2 max-w-sm text-sm text-foreground/70">{recovery}</p>}
      {onRetry && (
        <Button
          onClick={onRetry}
          className="mt-6 h-11 rounded-sm font-bold"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
