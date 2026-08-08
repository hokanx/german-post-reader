"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Upload, CalendarClock, Settings } from "lucide-react";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { isNavItemActive } from "@/lib/nav-active";

type NavItem = {
  href: string;
  label: string;
  icon: typeof History;
  emphasized?: boolean;
};

export function AppNav({ language }: { language: AppLanguage }) {
  const pathname = usePathname();
  const copy = APP_COPY[language].nav;
  const isRtl = language === "ar";

  const items: NavItem[] = [
    { href: "/dashboard", label: copy.history, icon: History },
    { href: "/upload", label: copy.upload, icon: Upload, emphasized: true },
    { href: "/deadlines", label: copy.deadlines, icon: CalendarClock },
    { href: "/settings", label: copy.settings, icon: Settings },
  ];

  return (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={copy.navLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background sm:sticky sm:inset-x-auto sm:bottom-auto sm:top-0 sm:h-screen sm:w-20 sm:shrink-0 sm:border-t-0 sm:border-e-2"
    >
      <ul className="flex items-center justify-around px-2 py-2 sm:h-full sm:flex-col sm:justify-start sm:gap-3 sm:py-6">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px ${
                  item.emphasized
                    ? `-translate-y-3 border-2 border-border bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--border)] sm:translate-y-0 ${
                        active ? "ring-2 ring-offset-2 ring-ring ring-offset-background" : ""
                      }`
                    : active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
