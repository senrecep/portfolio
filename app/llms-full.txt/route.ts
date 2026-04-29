import profile from "@/content/en/profile.json";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

const LOCAL_SLUGS = new Set(["sample-blog-post", "sample-seo-guide"]);

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
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

  const localPosts = getAllBlogPosts("en");
  const profileSlugs = new Set(
    blogPosts.map((b) => (b as { slug?: string }).slug).filter(Boolean),
  );

  const blogSection = [
    ...blogPosts.map((b) => {
      const date = b.date ? ` (${b.date})` : "";
      const slug = (b as { slug?: string }).slug;
      const url =
        slug && LOCAL_SLUGS.has(slug)
          ? `${siteUrl}/en/blog/${slug}`
          : b.blogUrl;
      return `### ${b.title}${date}\n- URL: ${url}\n- Summary: ${b.description}`;
    }),
    ...localPosts
      .filter((p) => !profileSlugs.has(p.slug))
      .map((p) => {
        const date = p.date ? ` (${p.date})` : "";
        return `### ${p.title}${date}\n- URL: ${siteUrl}/en/blog/${p.slug}\n- Summary: ${p.description}`;
      }),
  ].join("\n\n");

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

> This document provides deep context for AI models about ${personalInfo.name}'s professional background,
> technical expertise, work history, projects, and publications.
> For a summary version, see: ${siteUrl}/llms.txt

## Professional Summary

${personalInfo.about}

## Work History

<!-- Add your work history to content/en/profile.json under the "experience" field -->

## Skills Inventory

${skillsSection}

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

${socialSection}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
