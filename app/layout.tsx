import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/shared/ClientProviders";
import { GoogleTagManagerHead } from "@/components/shared/GoogleTagManager";
import MicrosoftClarity from "@/components/shared/MicrosoftClarity";
import { defaultLanguage } from "@/lib/i18n/config";
import { buildMetadataWithAbsoluteUrls } from "@/lib/i18n/metadata-utils";
import { getSEOMetadata } from "@/lib/i18n/server-content-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // Optimize font loading for better performance
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Optimize font loading for better performance
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSEOMetadata(defaultLanguage);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    ...buildMetadataWithAbsoluteUrls(metadata, siteUrl),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.json",
    appleWebApp: {
      title: "Recep Şen",
      capable: true,
      statusBarStyle: "black-translucent",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={defaultLanguage} suppressHydrationWarning>
      <head>
        {/* Preload critical LCP image */}
        <link
          rel="preload"
          href="/images/profile.webp"
          as="image"
          type="image/webp"
        />
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {gtmId && <GoogleTagManagerHead GTM_ID={gtmId} />}
        <MicrosoftClarity />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders gtmId={gtmId}>{children}</ClientProviders>
      </body>
    </html>
  );
}
