import profile from "@/content/en/profile.json";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

const LOCAL_SLUGS = new Set([
  "ai-coding-tools-complete-guide",
  "google-cloud-secret-manager-dotnet",
  "modern-way-manage-csharp-business-rules",
  "performance-analysis-parameter-passing-csharp",
  "production-grade-ai-development-claude-code",
  "stop-writing-code-start-managing-systems",
]);

export function GET() {
  const siteUrl = "https://senrecep.com";
  const { personalInfo, projects, blogPosts, socialLinks } = profile;

  const projectLines = projects
    .map((p) => `- [${p.title}](${p.projectUrl}): ${p.description}`)
    .join("\n");

  const localPosts = getAllBlogPosts("en");

  const blogLines = blogPosts
    .map((b) => {
      const slug = (b as { slug?: string }).slug;
      const url =
        slug && LOCAL_SLUGS.has(slug)
          ? `${siteUrl}/en/blog/${slug}`
          : b.blogUrl;
      return `- [${b.title}](${url}): ${b.description}`;
    })
    .join("\n");

  // Add local posts not in profile.json
  const profileSlugs = new Set(
    blogPosts.map((b) => (b as { slug?: string }).slug).filter(Boolean),
  );
  const extraLines = localPosts
    .filter((p) => !profileSlugs.has(p.slug))
    .map(
      (p) => `- [${p.title}](${siteUrl}/en/blog/${p.slug}): ${p.description}`,
    )
    .join("\n");

  const allBlogLines = [blogLines, extraLines].filter(Boolean).join("\n");

  const socialLines = socialLinks
    .map((s) => `- [${s.name}](${s.url})`)
    .join("\n");

  const content = `# ${personalInfo.name}

> ${personalInfo.about}

For complete professional profile see: ${siteUrl}/llms-full.txt
RSS Feed: ${siteUrl}/feed.xml

## Pages

- [Portfolio](${siteUrl}/en): Homepage with skills, projects, and blog posts
- [Resume](${siteUrl}/en/resume): Full CV and work experience
- [CV PDF](${siteUrl}${personalInfo.cv.url}): Downloadable resume

## Projects

${projectLines}

## Blog Posts

${allBlogLines}

## Contact

- Email: ${personalInfo.email}
${socialLines}

## Full Profile

- [Complete AI Context](${siteUrl}/llms-full.txt): Comprehensive professional profile for AI deep-context consumption
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
