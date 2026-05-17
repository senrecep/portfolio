import { getAllBlogSlugs } from "@/lib/blog";
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
          ...(personalInfo.companyUrl ? { url: personalInfo.companyUrl } : {}),
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What technologies does Recep Şen specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Şen specializes in .NET/C# for backend systems, with deep expertise in microservices architecture and Domain-Driven Design (DDD). On the data layer, he works with PostgreSQL, Redis, RabbitMQ, MongoDB, and Elasticsearch. For cloud infrastructure, he uses Google Cloud Platform, Docker, and Kubernetes. On the frontend, he works with TypeScript, Next.js, and React. He also works extensively with agentic AI systems, LLM integration, vector databases, and AI workflow automation.",
        },
      },
      {
        "@type": "Question",
        name: "What is the scale of the Easyapp platform that Recep Şen built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Şen led the full architecture and development of Easyapp.ai from inception, a no-code mobile app builder that reached 250,000+ users. He designed a 28-service microservices platform that processes millions of app-building requests. The platform uses AI-driven cost optimization to run capital-efficiently using on-demand infrastructure, significantly reducing operating costs compared to always-on architectures. He served as CTO at Taptoweb, the company behind Easyapp, overseeing the full technology organization and system architecture.",
        },
      },
      {
        "@type": "Question",
        name: "What open-source projects has Recep Şen built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Şen has built several notable open-source projects available on GitHub. CSharpEssentials is a C# library implementing the Result Pattern, Any Pattern, and Maybe Pattern, with over 59,000 NuGet package downloads across 16 packages. He also created an Aspire Microservice Starter Template that provides a production-ready foundation for .NET microservices using the .NET Aspire orchestration framework. Additionally, he maintains an open-source Next.js portfolio template (MIT licensed) used by developers worldwide.",
        },
      },
      {
        "@type": "Question",
        name: "Where does Recep Şen work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Şen is CTO at Taptoweb, a technology company building no-code mobile app solutions. In this role, he leads all technical decisions, system architecture, and engineering team direction. He has been with Taptoweb since 2022, growing the platform from early-stage to 250,000+ users. His work spans backend systems, cloud infrastructure, mobile platforms, and agentic AI integrations.",
        },
      },
      {
        "@type": "Question",
        name: "What is Recep Şen's background in AI development?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recep Şen works with agentic AI frameworks, having published comprehensive guides on Claude Code, OpenCode, and multi-agent orchestration systems. He has hands-on experience with LLM integration and fine-tuning, vector databases, semantic caching systems, and AI workflow automation. His practical AI work includes building AI-driven cost optimization systems for large-scale infrastructure and developing production AI workflows across multiple enterprise projects. He has written extensively on AI-powered development, with articles on Claude Code ecosystems, multi-agent systems, and AI development best practices.",
        },
      },
    ],
  };

  const portfolioProject = projects?.find((p) => p.featured === true);

  const softwareAppSchema = portfolioProject
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: portfolioProject.title,
        description: portfolioProject.description,
        url: portfolioProject.projectUrl,
        codeRepository: portfolioProject.projectUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        author: { "@id": personId },
        license: "https://opensource.org/licenses/MIT",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }
    : null;

  const localBlogSlugs = new Set(getAllBlogSlugs());

  const blogListSchema =
    blogPosts && blogPosts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: blogPosts.map((post, index) => {
            const postUrl =
              post.slug && localBlogSlugs.has(post.slug)
                ? `${siteUrl}/${lang}/blog/${post.slug}`
                : post.blogUrl || "";
            const postImage = post.imageUrl
              ? post.imageUrl.startsWith("http")
                ? post.imageUrl
                : `${siteUrl}${post.imageUrl}`
              : undefined;
            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.description || "",
                url: postUrl,
                ...(post.date ? { datePublished: post.date } : {}),
                author: {
                  "@type": "Person",
                  "@id": personId,
                  name: personalInfo.name,
                },
                ...(postImage ? { image: postImage } : {}),
                inLanguage: lang,
                isPartOf: { "@type": "WebSite", "@id": websiteId },
              },
            };
          }),
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
