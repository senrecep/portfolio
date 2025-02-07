import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const languages = ["en", "tr", "de"];
  const lastModified = new Date();

  // Create language-specific routes
  const languageRoutes = languages.map((lang) => ({
    url: `${siteUrl}/${lang}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
  }));

  // Create root route that redirects to default language
  const rootRoute = {
    url: siteUrl,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  return [rootRoute, ...languageRoutes];
}

