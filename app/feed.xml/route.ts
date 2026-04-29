import { getAllBlogPosts, getAvailableLanguagesForSlug } from "@/lib/blog";

export const dynamic = "force-static";

const siteUrl = "https://senrecep.com";
const siteTitle = "Recep Şen - Blog";
const siteDescription =
  "Technical blog by Recep Şen on .NET, microservices, AI development, and software engineering.";
const authorName = "Recep Şen";
const authorEmail = "me@senrecep.com";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const posts = getAllBlogPosts("en");

  const items = posts
    .map((post) => {
      const canonicalUrl = `${siteUrl}/en/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const availableLangs = getAvailableLanguagesForSlug(post.slug);

      // Only emit hreflang links when the post truly exists in multiple languages
      const hreflangLinks =
        availableLangs.length > 1
          ? [
              ...availableLangs.map(
                (lang) =>
                  `      <atom:link rel="alternate" hreflang="${lang}" href="${siteUrl}/${lang}/blog/${post.slug}"/>`,
              ),
              `      <atom:link rel="alternate" hreflang="x-default" href="${canonicalUrl}"/>`,
            ].join("\n")
          : "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${canonicalUrl}</link>
      <guid isPermaLink="true">${canonicalUrl}</guid>
      <description>${escapeXml(post.description || "")}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(authorEmail)} (${escapeXml(authorName)})</author>
      <category>${escapeXml(post.category || "Technology")}</category>${hreflangLinks ? `\n${hreflangLinks}` : ""}
    </item>`;
    })
    .join("\n");

  const buildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}/en/blog</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(authorEmail)} (${escapeXml(authorName)})</managingEditor>
    <webMaster>${escapeXml(authorEmail)} (${escapeXml(authorName)})</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>1440</ttl>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
