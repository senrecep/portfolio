import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { formatDate, languageCodes } from "@/lib/i18n/config";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return languageCodes.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: "Blog - Recep Sen",
    description:
      "Technical articles on software architecture, AI development, and .NET",
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const posts = getAllBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Technical articles on software architecture, AI development, and .NET
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-xl border border-border bg-card overflow-hidden shadow-glass-sm hover:shadow-glass transition-shadow duration-300"
          >
            {post.imageUrl && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="p-6">
              <time className="text-sm text-muted-foreground">
                {formatDate(post.date, lang)}
              </time>
              <h2 className="mt-2 text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read Article
                </Link>
                <span className="text-muted-foreground text-xs">·</span>
                <a
                  href={post.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Read on Medium
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
