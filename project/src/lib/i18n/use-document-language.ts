"use client";

import { useSyncExternalStore } from "react";
import type { AppLanguage } from "@/lib/letters/types";
import { isAppLanguage } from "@/lib/letters/types";

/**
 * Resolves the UI language inside a client component that cannot reach the
 * server helpers.
 *
 * `error.tsx` files must be client components (Next requirement), so they
 * cannot call `getPreAuthLanguage()` — it reads cookies on the server. That is
 * why every error boundary shipped hardcoded English while correct
 * translations sat unreferenced in copy.ts.
 *
 * The root layout already resolves the language server-side and writes it to
 * `<html lang>`, so reading it back from the DOM needs no cookie parsing and
 * cannot disagree with the rest of the page.
 *
 * useSyncExternalStore (rather than useEffect) is what lets a DOM-only read
 * settle in after hydration without a setState-in-effect. The server snapshot
 * is "en" because there is no document during SSR; for an error screen a
 * single frame of English before it corrects itself is an acceptable trade
 * for never mismatching hydration.
 */
function subscribe() {
  return () => {};
}

function getSnapshot(): AppLanguage {
  const lang = document.documentElement.lang;
  return isAppLanguage(lang) ? lang : "en";
}

function getServerSnapshot(): AppLanguage {
  return "en";
}

export function useDocumentLanguage(): AppLanguage {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
