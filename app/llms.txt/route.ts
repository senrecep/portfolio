import profile from "@/content/en/profile.json";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://senrecep.dev";
  const { personalInfo, projects, blogPosts, socialLinks } = profile;

  const projectLines = projects
    .map((p) => `- [${p.title}](${p.projectUrl}): ${p.description}`)
    .join("\n");

  const blogLines = blogPosts
    .map((b) => `- [${b.title}](${b.blogUrl}): ${b.description}`)
    .join("\n");

  const socialLines = socialLinks
    .map((s) => `- [${s.name}](${s.url})`)
    .join("\n");

  const content = `# ${personalInfo.name}

> ${personalInfo.about}

## Pages

- [Portfolio](${siteUrl}/en): Homepage with skills, projects, and blog posts
- [Resume](${siteUrl}/en/resume): Full CV and work experience
- [CV PDF](${siteUrl}${personalInfo.cv.url}): Downloadable resume

## Projects

${projectLines}

## Blog Posts

${blogLines}

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
