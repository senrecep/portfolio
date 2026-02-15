import { languageCodes } from "@/lib/i18n/config";
import type { Profile } from "@/lib/i18n/content-loader";

interface JsonLdProps {
  profile: Profile;
  siteUrl: string;
  siteName: string;
  lang: string;
}

// Safe: All data comes from static JSON profile files at build time, not user input.
// JSON.stringify also escapes any special characters, preventing injection.

export function JsonLd({ profile, siteUrl, siteName, lang }: JsonLdProps) {
  const { personalInfo, socialLinks, skills, certificates, blogPosts } =
    profile;

  const langUrl = `${siteUrl}/${lang}`;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  // Extract skill names for knowsAbout
  const skillNames: string[] = [];
  if (Array.isArray(skills)) {
    for (const category of skills) {
      if (typeof category === "object" && "items" in category) {
        for (const item of category.items) {
          skillNames.push(item.name);
        }
      } else if (typeof category === "string") {
        skillNames.push(category);
      }
    }
  }

  const sameAs = socialLinks?.map((link) => link.url) || [];

  const hasCredential =
    certificates && certificates.length > 0
      ? certificates.map((cert) => ({
          "@type": "EducationalOccupationalCredential" as const,
          name: cert.title,
          credentialCategory: "certificate",
          recognizedBy: {
            "@type": "Organization" as const,
            name: cert.issuer,
          },
          ...(cert.credentialUrl ? { url: cert.credentialUrl } : {}),
        }))
      : undefined;

  const imageUrl = personalInfo.imageUrl.startsWith("/")
    ? `${siteUrl}${personalInfo.imageUrl}`
    : personalInfo.imageUrl;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: personalInfo.name,
    jobTitle: personalInfo.position,
    worksFor: personalInfo.company
      ? {
          "@type": "Organization",
          name: personalInfo.company,
          url: "https://taptoweb.com",
        }
      : undefined,
    description: personalInfo.about,
    url: langUrl,
    image: imageUrl,
    email: personalInfo.email || undefined,
    telephone: personalInfo.phoneNumber || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: skillNames.length > 0 ? skillNames : undefined,
    hasCredential,
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    name: siteName,
    url: langUrl,
    dateCreated: "2025-01-01",
    dateModified: "2026-02-15",
    mainEntity: { "@id": personId },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: siteUrl,
    inLanguage: languageCodes,
    author: { "@id": personId },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: personalInfo.name,
        item: langUrl,
      },
    ],
  };

  const blogListSchema =
    blogPosts && blogPosts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: blogPosts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              url: post.blogUrl,
              ...(post.date ? { datePublished: post.date } : {}),
              author: { "@id": personId },
              ...(post.imageUrl
                ? {
                    image: post.imageUrl.startsWith("/")
                      ? `${siteUrl}${post.imageUrl}`
                      : post.imageUrl,
                  }
                : {}),
            },
          })),
        }
      : null;

  const schemas = [
    personSchema,
    profilePageSchema,
    websiteSchema,
    breadcrumbSchema,
    ...(blogListSchema ? [blogListSchema] : []),
  ];

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          // Safe: content from static build-time JSON, escaped by JSON.stringify
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
