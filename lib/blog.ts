import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  mediumUrl: string;
  imageUrl: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  mediumUrl: string;
  imageUrl: string;
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data } = matter(content);
    return data as BlogPostMeta;
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);
    return { ...(data as BlogPostMeta), content };
  } catch {
    return null;
  }
}

export function getAllBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}
