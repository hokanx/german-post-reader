import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PosthogProvider } from "@/components/PosthogProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Papkram — Translate German Mail Instantly",
  description:
    "Translate a German letter and understand your mail in minutes. Upload a photo or PDF of any Behörde, bank, or landlord letter and get a plain-language summary, deadline alerts, and a ready-to-send reply — in English, Arabic, or Turkish.",
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
      "Upload a photo or PDF of any German letter and get a plain-language summary, deadlines, and a ready-to-send reply — in English, Arabic, or Turkish.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PosthogProvider>
            {children}
            <Toaster position="top-center" />
          </PosthogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
