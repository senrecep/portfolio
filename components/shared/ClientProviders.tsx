"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ContentProtection } from "@/components/shared/ContentProtection";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <ContentProtection />
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
