"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Send, Share2, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track-event";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

type SharePlatform = "instagram_story" | "whatsapp_story" | "whatsapp" | "messenger" | "telegram" | "more_apps" | "copy_link";

// lucide-react ships no brand/logo icons (trademark reasons) — same as
// share-buttons.tsx's X_LOGO_PATH, these are hand-traced brand glyphs, not
// a second icon library (still Lucide for every generic icon here).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.32a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24m-4.53 4.71c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.71 4.21 3.7 2.08.83 2.5.66 2.96.62.45-.04 1.45-.6 1.66-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.36-.77-1.85-.2-.48-.4-.42-.55-.42z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.36 18.6 20.2c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.5c.41-.36-.09-.56-.63-.2L6.06 12.8 1.06 11.24c-1.08-.34-1.1-1.08.23-1.6L20.5 3.05c.9-.33 1.69.2 1.4 1.31z" />
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

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid items-center gap-12 md:grid-cols-2"
      >
        <div>
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {t.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
            {t.heading}
          </h2>
          <p className="mt-3 text-base text-foreground/70">{t.body}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => sharePosterImage("instagram_story")}
              className="flex h-12 items-center gap-2.5 rounded-full border-2 border-border bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <InstagramIcon className="size-4" />
              {t.instagramStory}
            </button>
            <button
              type="button"
              onClick={() => sharePosterImage("whatsapp_story")}
              className="flex h-12 items-center gap-2.5 rounded-full border-2 border-border bg-accent px-5 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <WhatsappIcon className="size-4" />
              {t.whatsappStory}
            </button>
          </div>
          <p className="mt-3 max-w-md text-xs text-foreground/60">{t.imageShareNote}</p>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">{t.orSendItIn}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleWhatsapp}
              className="flex h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <WhatsappIcon className="size-4" />
              {t.whatsapp}
            </button>
            <button
              type="button"
              onClick={handleMessenger}
              className="flex h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Send className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.messenger}
            </button>
            <button
              type="button"
              onClick={handleTelegram}
              className="flex h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TelegramIcon className="size-4" />
              {t.telegram}
            </button>
            <button
              type="button"
              onClick={handleMoreApps}
              className="flex h-11 items-center gap-2 text-sm font-bold text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Share2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.moreApps}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t-2 border-border pt-6">
            <span className="rounded-full border-2 border-border bg-muted px-4 py-2 font-mono text-sm text-foreground">
              papkram.de
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-10 items-center gap-1.5 text-sm font-bold text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t.copyLink}
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[280px] rounded-[2.5rem] border-2 border-border bg-foreground p-3 shadow-[8px_8px_0_0_var(--border)]">
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.75rem]">
            <Image
              src="/share-cards/story.png"
              alt={t.shareCardHeadline}
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
