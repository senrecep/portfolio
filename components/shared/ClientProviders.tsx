"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import { GoogleTagManagerBody } from "@/components/shared/GoogleTagManager";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

interface ClientProvidersProps {
  children: React.ReactNode;
  gaId?: string;
  gtmId?: string;
}

export function ClientProviders({ children, gaId, gtmId }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      {gtmId && <GoogleTagManagerBody GTM_ID={gtmId} />}
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="theme"
      >
        {children}
      </NextThemesProvider>

      {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
    </ErrorBoundary>
  );
}