"use client";

import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Share2, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

type SharePlatform = "whatsapp" | "messenger" | "telegram" | "more_apps" | "copy_link";

// lucide-react ships no brand/logo icons (trademark reasons) — same as
// share-buttons.tsx's X_LOGO_PATH, these are hand-traced brand glyphs, not
// a second icon library (still Lucide for every generic icon here).
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
    </svg>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M12 3c5 0 9 3.7 9 8.4 0 4.6-4 8.4-9 8.4a10 10 0 0 1-2.6-.3L5 21l1-3.6A8.2 8.2 0 0 1 3 11.4C3 6.7 7 3 12 3z" />
      <path d="M7.5 14l3-4.5 2.5 2 2.5-3" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M21 4L3 11l5 2 2 6 3-4 5 3z" />
      <path d="M8 13l9-6" />
    </svg>
  );
}

function shareUrl(base: string, via: SharePlatform) {
  const url = new URL(base);
  url.searchParams.set("src", "share");
  url.searchParams.set("via", via);
  return url.toString();
}

export function PassItOn() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const t = copy.passItOn;

  function landingUrl(via: SharePlatform) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://papkram.de";
    return shareUrl(origin, via);
  }

  function handleWhatsapp() {
    trackEvent("share_link_clicked", { platform: "whatsapp" });
    const url = new URL("https://wa.me/");
    url.searchParams.set("text", landingUrl("whatsapp"));
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  // Messenger's web share dialog (facebook.com/dialog/send) needs a
  // registered Facebook App ID, which this project doesn't have — the
  // mobile deep link needs none and opens the Messenger app directly
  // (no graceful desktop fallback, same category of limitation as any
  // app-only deep link).
  function handleMessenger() {
    trackEvent("share_link_clicked", { platform: "messenger" });
    const url = new URL("fb-messenger://share");
    url.searchParams.set("link", landingUrl("messenger"));
    window.location.href = url.toString();
  }

  function handleTelegram() {
    trackEvent("share_link_clicked", { platform: "telegram" });
    const url = new URL("https://t.me/share/url");
    url.searchParams.set("url", landingUrl("telegram"));
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  // Prefers attaching the locale-matched card image (the "SEND THIS TO
  // SOMEONE WHO CAN'T READ THEIR GERMAN LETTER" cards) over a bare link,
  // since the native share sheet supports files here — falls back to a
  // link-only share, then to copying the link, as file support narrows.
  async function handleMoreApps() {
    trackEvent("share_link_clicked", { platform: "more_apps" });
    const url = landingUrl("more_apps");

    if (typeof navigator.share === "function") {
      let file: File | null = null;
      try {
        const response = await fetch(`/share-cards/${locale}.png`);
        if (response.ok) {
          const blob = await response.blob();
          file = new File([blob], "papkram-share.png", { type: "image/png" });
        }
      } catch (error) {
        console.error("share card fetch failed", error);
      }

      const canShareFiles = file && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
      try {
        await navigator.share(canShareFiles ? { files: [file as File], url } : { url });
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          console.error("navigator.share failed (more apps)", error);
          toast.error(t.moreAppsFailed);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.linkCopiedToast);
    } catch (error) {
      console.error("navigator.clipboard.writeText failed", error);
      toast.error(t.moreAppsFailed);
    }
  }

  async function handleCopyLink() {
    trackEvent("share_link_clicked", { platform: "copy_link" });
    try {
      await navigator.clipboard.writeText(landingUrl("copy_link"));
      toast.success(t.linkCopiedToast);
    } catch (error) {
      console.error("navigator.clipboard.writeText failed", error);
      toast.error(t.moreAppsFailed);
    }
  }

  const outlinePill = cn(buttonVariants({ variant: "outline" }), "h-11 gap-2 rounded-full px-4 text-sm font-bold");

  return (
    <section dir={copy.dir} className="border-t-2 border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-24 md:py-26">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.07em] text-muted-foreground">
            {t.eyebrow}
          </span>
          <h2
            className="mt-5 max-w-[18em] font-heading font-extrabold tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(34px,4vw,52px)", lineHeight: 1.02 }}
          >
            {t.heading}
          </h2>
          <p className="mt-4 max-w-[40em] text-[17px] leading-relaxed text-foreground/72 [text-wrap:pretty]">{t.body}</p>

          <p className="mt-8.5 font-mono text-[11px] tracking-[0.14em] text-foreground/50 uppercase">{t.orSendItIn}</p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            <button type="button" onClick={handleWhatsapp} className={outlinePill}>
              <WhatsappIcon className="size-4" />
              {t.whatsapp}
            </button>
            <button type="button" onClick={handleMessenger} className={outlinePill}>
              <MessengerIcon className="size-4" />
              {t.messenger}
            </button>
            <button type="button" onClick={handleTelegram} className={outlinePill}>
              <TelegramIcon className="size-4" />
              {t.telegram}
            </button>
            <button
              type="button"
              onClick={handleMoreApps}
              className={cn(buttonVariants({ variant: "ghost" }), "h-11 gap-2 rounded-full px-3 text-sm font-bold")}
            >
              <Share2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.moreApps}
            </button>
          </div>

          <div className="mt-7.5 flex flex-wrap items-center gap-3 border-t-2 border-border pt-6.5">
            <code className="rounded-full border-2 border-border bg-card px-4.5 py-2.5 font-mono text-sm">papkram.de</code>
            <button
              type="button"
              onClick={handleCopyLink}
              className={cn(buttonVariants({ variant: "ghost" }), "h-11 gap-1.5 rounded-full px-3 text-sm font-bold")}
            >
              <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.copyLink}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
