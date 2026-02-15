import { languageCodes } from "@/lib/i18n/config";
import type { Profile } from "@/lib/i18n/content-loader";

interface JsonLdProps {
  profile: Profile;
  siteUrl: string;
  siteName: string;
}

export function JsonLd({ profile, siteUrl, siteName }: JsonLdProps) {
  const { personalInfo, socialLinks, skills, certificates } = profile;

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

  // Extract social links URLs
  const sameAs = socialLinks?.map((link) => link.url) || [];

  // Build credentials from certificates
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

  // Person Schema — enriched with @id, contact info, credentials
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
        }
      : undefined,
    description: personalInfo.about,
    url: siteUrl,
    image: imageUrl,
    email: personalInfo.email || undefined,
    telephone: personalInfo.phoneNumber || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: skillNames.length > 0 ? skillNames : undefined,
    hasOccupation: personalInfo.position
      ? {
          "@type": "Occupation",
          name: personalInfo.position,
        }
      : undefined,
    hasCredential,
  };

  // ProfilePage Schema — signals E-E-A-T to search engines
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    name: siteName,
    url: siteUrl,
    mainEntity: { "@id": personId },
  };

  // WebSite Schema — with @id cross-reference to Person
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: siteUrl,
    inLanguage: languageCodes,
    author: { "@id": personId },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Content is generated from trusted profile data, not user input
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
