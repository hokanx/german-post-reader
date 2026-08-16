import { Toaster, toast } from "papkram";
import { useEffect, useRef } from "react";

// Toasts are fired imperatively, so the preview raises them on mount and holds
// them open (duration: Infinity) long enough for the card to capture them.
// The ref guard keeps it to a single firing even though `fire` is a fresh
// closure on every render.
function useToasts(fire: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toast.dismiss();
    fire();
  }, [fire]);
}

export const Statuses = () => {
  useToasts(() => {
    toast.success("Letter analysed", { duration: Infinity });
    toast.error("Analysis failed — try again", { duration: Infinity });
    toast.warning("This letter mentions two different amounts", {
      duration: Infinity,
    });
    toast.info("Your reply draft was saved", { duration: Infinity });
  });
  // expand + visibleToasts so all four statuses show at once instead of
  // sonner's default collapsed stack (which reveals only the front toast).
  return <Toaster position="top-center" expand visibleToasts={4} />;
};

export const WithDescription = () => {
  useToasts(() => {
    toast.success("Reply draft ready", {
      description: "Written in German, with a translation underneath.",
      duration: Infinity,
    });
  });
  return <Toaster position="top-center" />;
};

export const Loading = () => {
  useToasts(() => {
    toast.loading("Reading your letter…", { duration: Infinity });
  });
  return <Toaster position="top-center" />;
};
