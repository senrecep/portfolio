"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";

interface ClientProvidersProps {
  children: React.ReactNode;
  gaId?: string;
}

export function ClientProviders({ children, gaId }: ClientProvidersProps) {
  return (
    <>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>

      <Analytics />

      {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
    </>
  );
}
