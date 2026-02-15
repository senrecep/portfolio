"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ContentProtection } from "@/components/shared/ContentProtection";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { GoogleTagManagerBody } from "@/components/shared/GoogleTagManager";

interface ClientProvidersProps {
  children: React.ReactNode;
  gtmId?: string;
}

export function ClientProviders({ children, gtmId }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <ContentProtection />
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
    </ErrorBoundary>
  );
}
