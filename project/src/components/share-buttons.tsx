"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track-event";

const X_LOGO_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

export type ShareButtonsCopy = {
  shareTwitter: string;
  shareWhatsapp: string;
  shareCopyLink: string;
  shareTweetText: string;
  shareWhatsappText: string;
  linkCopiedToast: string;
  linkCopyFailed: string;
};

function shareUrl(base: string, via: "twitter" | "whatsapp" | "copy_link") {
  const url = new URL(base);
  url.searchParams.set("src", "share");
  url.searchParams.set("via", via);
  return url.toString();
}

/** Shared by the authenticated /welcome screen and the pre-auth landing page — each passes its own copy dictionary rather than this component owning one. */
export function ShareButtons({ copy }: { copy: ShareButtonsCopy }) {
  function landingUrl(via: "twitter" | "whatsapp" | "copy_link") {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://papkram.de";
    return shareUrl(origin, via);
  }

  function handleTwitterShare() {
    trackEvent("share_link_clicked", { platform: "twitter" });
    const url = new URL("https://x.com/intent/tweet");
    url.searchParams.set("text", copy.shareTweetText);
    url.searchParams.set("url", landingUrl("twitter"));
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function handleWhatsappShare() {
    trackEvent("share_link_clicked", { platform: "whatsapp" });
    const url = new URL("https://wa.me/");
    url.searchParams.set("text", `${copy.shareWhatsappText} ${landingUrl("whatsapp")}`);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    trackEvent("share_link_clicked", { platform: "copy_link" });
    try {
      await navigator.clipboard.writeText(landingUrl("copy_link"));
      toast.success(copy.linkCopiedToast);
    } catch (error) {
      console.error("navigator.clipboard.writeText failed", error);
      toast.error(copy.linkCopyFailed);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handleTwitterShare}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={X_LOGO_PATH} />
        </svg>
        {copy.shareTwitter}
      </button>
      <button
        type="button"
        onClick={handleWhatsappShare}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.32a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24m-4.53 4.71c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.71 4.21 3.7 2.08.83 2.5.66 2.96.62.45-.04 1.45-.6 1.66-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.36-.77-1.85-.2-.48-.4-.42-.55-.42z" />
        </svg>
        {copy.shareWhatsapp}
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {copy.shareCopyLink}
      </button>
    </div>
  );
}
