"use client";

import { Lock, ShieldCheck, Server } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const ICONS = [Lock, ShieldCheck, Server];

export function TrustBadgeStrip() {
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <div dir={copy.dir} className="border-y-2 border-border bg-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-3 px-6 py-5">
        {copy.hero.trustBadges.map((label, i) => {
          const Icon = ICONS[i];
          return (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="size-[17px] shrink-0 text-primary" strokeWidth={1.8} aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
