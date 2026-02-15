import type { MetadataRoute } from "next";
import { defaultLanguage, languageCodes } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModified = new Date("2026-02-15");

  // Build alternates object for hreflang with x-default
  const alternates: Record<string, string> = {};
  for (const lang of languageCodes) {
    alternates[lang] = `${siteUrl}/${lang}`;
  }
  alternates["x-default"] = `${siteUrl}/${defaultLanguage}`;

  // Language-specific homepage routes
  const languageRoutes = languageCodes.map((lang) => ({
    url: `${siteUrl}/${lang}`,
    lastModified,
    alternates: {
      languages: alternates,
    },
  }));

  // Resume routes for all languages
  const resumeAlternates: Record<string, string> = {};
  for (const lang of languageCodes) {
    resumeAlternates[lang] = `${siteUrl}/${lang}/resume`;
  }
  resumeAlternates["x-default"] = `${siteUrl}/${defaultLanguage}/resume`;

  const resumeRoutes = languageCodes.map((lang) => ({
    url: `${siteUrl}/${lang}/resume`,
    lastModified,
    alternates: {
      languages: resumeAlternates,
    },
  }));

  return [...languageRoutes, ...resumeRoutes];
}
