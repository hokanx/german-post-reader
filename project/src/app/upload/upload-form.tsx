"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { PaywallModal } from "@/components/PaywallModal";
import { uploadLetter } from "./actions";

export function UploadForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);
  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleFiles(files: FileList | null) {
    const picked = files?.[0];
    if (!picked) return;
    setFile(picked);
    setError(null);
    setTrialLimitReached(false);
  }

  function handleSubmit() {
    if (!file) return;
    setError(null);
    setTrialLimitReached(false);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadLetter(formData);
      if (!result.ok) {
        if (result.error.code === "TRIAL_LIMIT_REACHED") {
          setTrialLimitReached(true);
          return;
        }
        setError({ message: result.error.message, recovery: result.error.recovery });
        return;
      }
      router.push(`/letters/${result.data.letterId}`);
    });
  }

  if (pending) {
    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-md border-2 border-border bg-card px-8 py-20 text-center shadow-[4px_4px_0_0_var(--border)]"
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={shouldReduceMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="mb-5 flex size-16 items-center justify-center rounded-full border-2 border-border bg-accent"
        >
          <FileText className="size-6 text-accent-foreground" strokeWidth={1.5} aria-hidden="true" />
        </motion.div>
        <p className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
          Reading your letter…
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          This usually takes a few seconds.
        </p>
      </motion.div>
    );
  }

  if (trialLimitReached) {
    return <PaywallModal open={trialLimitReached} onOpenChange={setTrialLimitReached} />;
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          >
            <ErrorState
              message={error.message}
              recovery={error.recovery}
              onRetry={() => setError(null)}
              retryLabel="Dismiss"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-8 py-14 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isDragging ? "border-primary bg-primary/10" : "border-border bg-card"
        }`}
      >
        <div className="mb-4 flex size-14 items-center justify-center rounded-full border-2 border-border bg-muted">
          <Upload className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        </div>
        {file ? (
          <p className="font-medium text-foreground">{file.name}</p>
        ) : (
          <>
            <p className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              Drop a photo or PDF here
            </p>
            <p className="mt-1 text-sm text-foreground/70">or click to browse</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-sm border-2 border-border text-sm font-bold"
          onClick={() => {
            const cameraInput = document.createElement("input");
            cameraInput.type = "file";
            cameraInput.accept = "image/jpeg,image/png";
            cameraInput.capture = "environment";
            cameraInput.onchange = () => handleFiles(cameraInput.files);
            cameraInput.click();
          }}
        >
          <Camera className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Take a photo
        </Button>
        <Button
          type="button"
          disabled={!file}
          className="h-12 rounded-sm text-sm font-bold"
          onClick={handleSubmit}
        >
          Analyze letter
        </Button>
      </div>
    </div>
  );
}
