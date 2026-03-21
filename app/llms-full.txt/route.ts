import profile from "@/content/en/profile.json";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://senrecep.dev";
  const {
    personalInfo,
    skills,
    projects,
    blogPosts,
    certificates,
    socialLinks,
  } = profile;

  const skillsSection = (Array.isArray(skills) ? skills : [])
    .map((category) => {
      if (
        typeof category === "object" &&
        "name" in category &&
        "items" in category
      ) {
        const items = category.items
          .map((item) => `  - ${item.name} (${item.level})`)
          .join("\n");
        return `### ${category.name}\n${items}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");

  const projectsSection = projects
    .map((p) => {
      const tags = p.tags ? `\n  Tags: ${p.tags.join(", ")}` : "";
      return `### ${p.title} (${p.year})\n- URL: ${p.projectUrl}\n- Description: ${p.description}${tags}`;
    })
    .join("\n\n");

  const blogSection = blogPosts
    .map((b) => {
      const date = b.date ? ` (${b.date})` : "";
      return `### ${b.title}${date}\n- URL: ${b.blogUrl}\n- Summary: ${b.description}`;
    })
    .join("\n\n");

  const certificatesSection = certificates
    .map((c) => {
      const credUrl = c.credentialUrl
        ? `\n  - Credential URL: ${c.credentialUrl}`
        : "";
      const credId =
        "credentialId" in c && c.credentialId
          ? `\n  - Credential ID: ${c.credentialId}`
          : "";
      return `- ${c.title} - ${c.issuer} (${c.issueDate})${credId}${credUrl}`;
    })
    .join("\n");

  const socialSection = socialLinks
    .map((s) => `- [${s.name}](${s.url})`)
    .join("\n");

  const content = `# ${personalInfo.name} - Comprehensive AI Context Profile

> This document provides deep context for AI models about Recep Sen's professional background,
> technical expertise, work history, projects, and publications.
> For a summary version, see: ${siteUrl}/llms.txt

## Professional Summary

${personalInfo.about}

Recep Sen is CTO at Taptoweb, a technology company building no-code mobile app solutions. He has been
with Taptoweb since 2022, growing the platform from early-stage to 250,000+ users. He designed and
led the development of a 28-service microservices platform powering Easyapp.ai, a no-code mobile app
builder that processes millions of app-building requests using AI-driven cost optimization and
capital-efficient on-demand infrastructure.

He is an active open-source contributor with 59,809+ NuGet package downloads across 16 packages,
primarily through the CSharpEssentials library. He writes extensively on AI-powered development,
with published guides on Claude Code, OpenCode, and multi-agent orchestration systems.

## Work History

### CTO - Taptoweb (2022 - Present)
- Led architecture and development of Easyapp.ai, a no-code mobile app builder serving 250,000+ users
- Designed a 28-service microservices platform processing millions of app-building requests
- Implemented AI-driven cost optimization with on-demand infrastructure to reduce operating costs
- Oversaw full technology organization: system architecture, engineering direction, and technical strategy
- Built and integrated agentic AI workflows and LLM-powered automation into production systems
- Stack: .NET/C#, PostgreSQL, Redis, RabbitMQ, Google Cloud Platform, Docker, Kubernetes, TypeScript

## Skills Inventory

${skillsSection}

## NuGet Packages

- **CSharpEssentials**: C# library implementing the Result Pattern, Any Pattern, and Maybe Pattern
  - 59,809+ total downloads across 16 NuGet packages
  - URL: https://www.nuget.org/profiles/senrecep
- **Aspire Microservice Starter Template**: Production-ready .NET Aspire orchestration starter
  - URL: https://github.com/senrecep/Aspire

## Projects

${projectsSection}

## Blog Posts & Publications

${blogSection}

## Certificates & Credentials

${certificatesSection}

## Pages

- [Portfolio](${siteUrl}/en): Homepage with skills, projects, and blog posts
- [Resume](${siteUrl}/en/resume): Full CV and work experience
- [CV PDF](${siteUrl}${personalInfo.cv.url}): Downloadable resume

## Contact Information

- Email: ${personalInfo.email}
- Phone: ${personalInfo.phoneNumber}
- Amateur Radio Callsign: ${personalInfo.callsign}
${socialSection}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
