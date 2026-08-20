"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ShareButtons } from "@/components/share-buttons";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const POLL_INTERVAL_MS = 30_000;

/**
 * `registeredCount` is `null` when the count couldn't be determined (Supabase
 * query error, service client failing to construct, etc.) — that renders as
 * the counter chip being genuinely absent, never as a false "0 signed up".
 */
export function DemoPitch({ registeredCount }: { registeredCount: number | null }) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  // Server-rendered count is the first paint; polling keeps it live for
  // anyone who lingers on the page without a refresh. A failed poll is left
  // alone (keeps showing the last known-good count) — only an explicit
  // `count: null` response (the API route's own "unknown" case) clears it.
  const [liveCount, setLiveCount] = useState(registeredCount);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/registered-count");
        if (!response.ok) return;
        const data: { count: number | null } = await response.json();
        if (data.count !== null) {
          setLiveCount(data.count);
        }
      } catch (error) {
        console.error("registered-count poll failed", error);
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          {liveCount !== null && (
            <span className="inline-block rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
              {copy.demoPitch.counter(liveCount)}
            </span>
          )}
          <h2
            className={`font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground md:text-3xl ${liveCount !== null ? "mt-4" : ""}`}
          >
            {copy.demoPitch.heading}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">{copy.demoPitch.body(FREE_LETTER_LIMIT)}</p>
          <Link
            href="/signup"
            className={buttonVariants({ className: "mt-6 h-12 w-full rounded-sm text-base font-bold" })}
          >
            {copy.demoPitch.cta}
          </Link>

          <div className="mt-6 border-t-2 border-border pt-6">
            <p className="mb-3 text-sm font-bold text-foreground">{copy.demoPitch.share.heading}</p>
            <ShareButtons
              copy={{
                shareTwitter: copy.demoPitch.share.twitter,
                shareWhatsapp: copy.demoPitch.share.whatsapp,
                shareCopyLink: copy.demoPitch.share.copyLink,
                shareTweetText: copy.demoPitch.share.tweetText,
                shareWhatsappText: copy.demoPitch.share.whatsappText,
                linkCopiedToast: copy.demoPitch.share.linkCopiedToast,
                linkCopyFailed: copy.demoPitch.share.linkCopyFailed,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
