import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { PosthogProvider } from "@/components/PosthogProvider";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { Toaster } from "@/components/ui/sonner";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
// Self-hosted (bundled npm packages, not a live fonts.gstatic.com fetch at
// build time) — next/font/google's live fetch was unreliable on Vercel's
// build machines (consistent 404s on one Bricolage Grotesque file). The
// resulting --font-heading/--font-body/--font-mono-custom custom properties
// are declared in globals.css's :root instead of via next/font's generated
// .variable classNames.
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Papkram — Translate German Mail Instantly",
  description:
    "Translate a German letter and understand your mail in minutes. Upload a photo or PDF of any Behörde, bank, or landlord letter and get a plain-language summary, deadline alerts, and a ready-to-send reply — in English, Arabic, Turkish, German, or Ukrainian.",
  keywords: [
    "translate German letter",
    "read German mail for expats",
    "German bureaucracy translator",
    "Behörde letter translation",
    "Papkram",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Papkram",
    title: "Papkram — Translate German Mail Instantly",
    description:
      "Upload a photo or PDF of any German letter and get a plain-language summary, deadlines, and a ready-to-send reply — in English, Arabic, Turkish, German, or Ukrainian.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papkram — Translate German Mail Instantly",
    description:
      "Upload a photo or PDF of any German letter and get a plain-language summary, deadlines, and a ready-to-send reply.",
  },
  alternates: {
    languages: {
      en: "/",
      ar: "/",
      tr: "/",
      de: "/",
      uk: "/",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Papkram",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reads the same `marketing_locale` cookie the landing page's switcher
  // writes, and that onboarding/settings/login now also keep in sync with
  // `profiles.language` (see get-locale.ts and the actions that set it) —
  // so <html lang> is correct for both pre-auth and authenticated pages
  // without a Supabase call on every request.
  const language = await getPreAuthLanguage();

  return (
    <html lang={language} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <PosthogProvider>
            {children}
            <Toaster position="top-center" />
            <CookieConsentBanner language={language} />
          </PosthogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
