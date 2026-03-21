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
  const {
    personalInfo,
    socialLinks,
    skills,
    certificates,
    blogPosts,
    projects,
  } = profile;

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
          ...(personalInfo.companyUrl
            ? { url: personalInfo.companyUrl }
            : { url: "https://taptoweb.com" }),
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".hero-title", ".hero-description"],
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    name: siteName,
    url: langUrl,
    dateCreated: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity: { "@id": personId },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: siteUrl,
    inLanguage: lang,
    author: { "@id": personId },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What technologies does Recep Sen specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Sen specializes in .NET/C#, microservices architecture, Domain-Driven Design (DDD), TypeScript, Next.js, PostgreSQL, Redis, RabbitMQ, Docker, Kubernetes, and agentic AI systems.",
        },
      },
      {
        "@type": "Question",
        name: "What is the scale of the Easyapp platform that Recep Sen built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Sen led the architecture and development of Easyapp.ai, a no-code mobile app builder serving 250,000+ users. He designed a 28-service microservices platform with AI-driven cost optimization and capital-efficient on-demand infrastructure.",
        },
      },
      {
        "@type": "Question",
        name: "What open-source projects has Recep Sen built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Sen has built several open-source projects including CSharpEssentials (a C# library implementing the Result Pattern, Any Pattern, and Maybe Pattern), an Aspire Microservice Starter Template for .NET, and an open-source Next.js portfolio template (MIT licensed).",
        },
      },
      {
        "@type": "Question",
        name: "Where does Recep Sen work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Sen is CTO at Taptoweb, where he leads technology and system architecture.",
        },
      },
      {
        "@type": "Question",
        name: "What is Recep Sen's background in AI development?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Sen works with agentic AI frameworks such as AutoGen, LLM integration and fine-tuning, vector databases, semantic caching systems, and AI workflow automation. He has written extensively about AI-powered development tools including Claude Code.",
        },
      },
    ],
  };

  const easyappProject = projects?.find(
    (p) => p.projectUrl === "https://easyapp.ai",
  );

  const softwareAppSchema = easyappProject
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: easyappProject.title,
        description: easyappProject.description,
        url: easyappProject.projectUrl,
        applicationCategory: "MobileApplication",
        operatingSystem: "iOS, Android",
        author: { "@id": personId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }
    : null;

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
    faqSchema,
    ...(softwareAppSchema ? [softwareAppSchema] : []),
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
