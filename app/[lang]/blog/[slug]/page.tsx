import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { formatDate, languageCodes } from "@/lib/i18n/config";
import { getProfile } from "@/lib/i18n/server-content-loader";
import { translations } from "@/lib/i18n/translations";
import { BlogContent } from "./BlogContent";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams() {
  return languageCodes.flatMap((lang) => {
    const slugs = getAllBlogSlugs(lang);
    return slugs.map((slug) => ({ lang, slug }));
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getBlogPost(slug, lang);
  if (!post) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: `${post.title} - Recep Sen`,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/${post.lang}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const post = getBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  const profile = await getProfile(lang);
  const t = translations[lang];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        profile={profile}
        translations={{ downloadCV: t.actions.downloadCV }}
        language={lang}
      />
      <main className="container mx-auto px-4 py-12 max-w-3xl flex-1">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          &larr; Back to Blog
        </Link>

        {post.imageUrl && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <time className="text-sm text-muted-foreground">
            {formatDate(post.date, lang)}
          </time>
          <h1 className="mt-2 text-3xl font-bold leading-tight">{post.title}</h1>
          <p className="mt-3 text-muted-foreground">{post.description}</p>
          <div className="mt-4">
            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Originally published on Medium &rarr;
            </a>
          </div>
        </header>

        <BlogContent content={post.content} />
      </main>
      <Footer
        profile={profile}
        lang={lang}
        translations={{ allRightsReserved: t.footer.allRightsReserved }}
      />
    </div>
  );
}
