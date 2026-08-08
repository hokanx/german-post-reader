"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { PaywallModal } from "@/components/PaywallModal";
import { trackEvent } from "@/lib/analytics/track-event";
import { compressImageIfNeeded } from "@/lib/image-compression";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { uploadLetter } from "./actions";

// Vercel's serverless functions have a hard 4.5MB request body ceiling that
// no Next.js config can raise (docs.vercel.com/docs/errors/function_payload_too_large).
// Images get compressed client-side first (see image-compression.ts) so they
// almost never hit this; PDFs pass through untouched, so they're checked
// directly against a safe margin below the platform limit.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function UploadForm({ language }: { language: AppLanguage }) {
  const copy = APP_COPY[language].upload;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [preparing, setPreparing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);
  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  async function handleFiles(files: FileList | null) {
    const picked = files?.[0];
    if (!picked) return;

    setError(null);
    setTrialLimitReached(false);
    setFile(null);
    setPreparing(true);

    const prepared = await compressImageIfNeeded(picked);

    if (prepared.size > MAX_UPLOAD_BYTES) {
      setPreparing(false);
      setError({
        message: copy.fileTooLarge,
        recovery:
          prepared.type === "application/pdf"
            ? copy.fileTooLargePdfRecovery
            : copy.fileTooLargeImageRecovery,
      });
      return;
    }

    setFile(prepared);
    setPreparing(false);
  }

  function handleSubmit() {
    if (!file) return;
    setError(null);
    setTrialLimitReached(false);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const result = await uploadLetter(formData);
        if (!result.ok) {
          if (result.error.code === "TRIAL_LIMIT_REACHED") {
            setTrialLimitReached(true);
            trackEvent("trial_limit_reached");
            return;
          }
          setError({ message: result.error.message, recovery: result.error.recovery });
          return;
        }
        trackEvent("letter_uploaded", { file_type: file.type });
        trackEvent("analysis_completed", { letter_id: result.data.letterId });
        router.push(`/letters/${result.data.letterId}`);
      } catch (err) {
        // Defense in depth: a server action call can fail before our code
        // ever runs (oversized request, network drop, timeout). Never let
        // that crash the page — always land on a recoverable message.
        console.error("Upload request failed", err);
        setError({
          message: copy.uploadFailed,
          recovery: copy.uploadFailedRecovery,
        });
      }
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
          {copy.readingTitle}
        </p>
        <p className="mt-2 text-sm text-foreground/70">{copy.readingSubtitle}</p>
      </motion.div>
    );
  }

  if (trialLimitReached) {
    return <PaywallModal open={trialLimitReached} onOpenChange={setTrialLimitReached} language={language} />;
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
              retryLabel={copy.dismiss}
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
          void handleFiles(e.dataTransfer.files);
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
        {preparing ? (
          <p className="font-medium text-foreground">{copy.preparingPhoto}</p>
        ) : file ? (
          <p className="font-medium text-foreground">{file.name}</p>
        ) : (
          <>
            <p className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              {copy.dropTitle}
            </p>
            <p className="mt-1 text-sm text-foreground/70">{copy.dropSubtitle}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
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
            cameraInput.onchange = () => void handleFiles(cameraInput.files);
            cameraInput.click();
          }}
        >
          <Camera className="size-4" strokeWidth={1.5} aria-hidden="true" />
          {copy.takePhoto}
        </Button>
        <Button
          type="button"
          disabled={!file || preparing}
          className="h-12 rounded-sm text-sm font-bold"
          onClick={handleSubmit}
        >
          {copy.analyzeLetter}
        </Button>
      </div>
    </div>
  );
}
