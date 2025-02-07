import fs from "fs/promises";
import path from "path";
import { translations, Translations } from "./translations";

export interface Project {
  title: string;
  description: string;
  projectUrl: string;
  tags: string[];
  imageUrl?: string;
}

export interface BlogPost {
  title: string;
  description: string;
  blogUrl: string;
  date: string;
  imageUrl?: string;
}

export interface Skill {
  name: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Profile {
  personalInfo: {
    name: string;
    position: string;
    company: string;
    about: string;
    imageUrl: string;
    cv?: {
      url: string;
      fileName: string;
    };
  };
  skills?: string[];
  certificates?: Certificate[];
  projects?: Project[];
  blogPosts?: BlogPost[];
  socialLinks: Array<{
    name: string;
    url: string;
  }>;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  openGraph: {
    siteName: string;
    url: string;
  };
  twitterCard: {
    card: "summary" | "summary_large_image" | "player" | "app";
    site: string;
    creator: string;
    image: string;
    imageAlt: string;
  };
}

export async function getProfile(locale: string): Promise<Profile> {
  const filePath = path.join(process.cwd(), "content", locale, "profile.json");
  const fileContent = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContent);
}

export async function getSEOMetadata(locale: string): Promise<SEOMetadata> {
  const filePath = path.join(process.cwd(), "content", locale, "metadata.json");
  const fileContent = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContent);
}

export function getTranslation(
  key: string,
  locale: keyof Translations
): string {
  const keys = key.split(".");
  let translation: unknown = translations[locale];

  for (const k of keys) {
    if (translation && typeof translation === "object" && k in translation) {
      translation = (translation as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof translation === "string" ? translation : key;
}

