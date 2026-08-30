"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type MarketingLocale = "en" | "ar" | "tr" | "de" | "uk";

type LocaleContextValue = {
  locale: MarketingLocale;
  setLocale: (locale: MarketingLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: MarketingLocale;
}) {
  const [locale, setLocaleState] = useState<MarketingLocale>(initialLocale);

  function setLocale(next: MarketingLocale) {
    setLocaleState(next);
    document.cookie = `marketing_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useMarketingLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useMarketingLocale must be used within a LocaleProvider");
  }
  return ctx;
}
