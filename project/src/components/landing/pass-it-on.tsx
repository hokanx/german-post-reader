"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Send, Share2, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

type SharePlatform = "instagram_story" | "whatsapp_story" | "whatsapp" | "messenger" | "telegram" | "more_apps" | "copy_link";

// lucide-react ships no brand/logo icons (trademark reasons) — same as
// share-buttons.tsx's X_LOGO_PATH, these are hand-traced brand glyphs, not
// a second icon library (still Lucide for every generic icon here).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
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

  async function sharePosterImage(platform: "instagram_story" | "whatsapp_story") {
    trackEvent("share_link_clicked", { platform });
    const loadingId = toast.loading(t.posterPreparingToast);

    let file: File;
    try {
      const response = await fetch("/share-cards/story.png");
      if (!response.ok) throw new Error(`poster fetch failed: ${response.status}`);
      const blob = await response.blob();
      file = new File([blob], "papkram-story.png", { type: "image/png" });
    } catch (error) {
      console.error("poster fetch failed", error);
      toast.error(t.moreAppsFailed, { id: loadingId });
      return;
    }
    toast.dismiss(loadingId);

    const canShareFiles = typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
    if (canShareFiles && typeof navigator.share === "function") {
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          console.error("navigator.share failed (poster)", error);
          toast.error(t.moreAppsFailed);
        }
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "papkram-story.png";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
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
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 md:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] md:py-26">
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

          <div className="mt-8.5 flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={() => sharePosterImage("instagram_story")}
              className={cn(buttonVariants(), "h-13 gap-2.5 rounded-full px-5 text-sm font-bold")}
            >
              <InstagramIcon className="size-[18px]" />
              {t.instagramStory}
            </button>
            <button
              type="button"
              onClick={() => sharePosterImage("whatsapp_story")}
              className={cn(buttonVariants({ variant: "outline" }), "h-13 gap-2.5 rounded-full px-5 text-sm font-bold")}
            >
              <WhatsappIcon className="size-[18px]" />
              {t.whatsappStory}
            </button>
          </div>
          <p className="mt-3.5 max-w-[36em] text-[13.5px] leading-relaxed text-foreground/55 [text-wrap:pretty]">{t.imageShareNote}</p>

          <p className="mt-7.5 font-mono text-[11px] tracking-[0.14em] text-foreground/50 uppercase">{t.orSendItIn}</p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            <button type="button" onClick={handleWhatsapp} className={outlinePill}>
              <WhatsappIcon className="size-4" />
              {t.whatsapp}
            </button>
            <button type="button" onClick={handleMessenger} className={outlinePill}>
              <Send className="size-4" strokeWidth={1.5} aria-hidden="true" />
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

        <div className="flex justify-center">
          <div className="w-full max-w-[300px] rotate-[1.5deg] overflow-hidden rounded-[34px] border-2 border-border bg-background shadow-[10px_10px_0_0_var(--border)]">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src="/share-cards/story.png"
                alt={t.shareCardHeadline}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
