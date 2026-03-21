"use client";

import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === "string") return child;
        if (
          child !== null &&
          typeof child === "object" &&
          "props" in child &&
          child.props !== null &&
          typeof child.props === "object" &&
          "children" in child.props
        ) {
          return extractText(
            (child.props as { children: React.ReactNode }).children,
          );
        }
        return "";
      })
      .join("");
  }
  return "";
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
}

function HeadingWithAnchor({ level, children }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const text = extractText(children);
  const id = slugify(text);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    window.location.hash = id;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  return (
    <Tag id={id} className="group relative scroll-mt-20">
      {children}
      <span className="relative inline-flex items-center align-middle ml-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link to section"
          className="inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        {copied && (
          <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
            Copied!
          </span>
        )}
      </span>
    </Tag>
  );
}

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <HeadingWithAnchor level={1}>{children}</HeadingWithAnchor>
          ),
          h2: ({ children }) => (
            <HeadingWithAnchor level={2}>{children}</HeadingWithAnchor>
          ),
          h3: ({ children }) => (
            <HeadingWithAnchor level={3}>{children}</HeadingWithAnchor>
          ),
          h4: ({ children }) => (
            <HeadingWithAnchor level={4}>{children}</HeadingWithAnchor>
          ),
          pre: ({ children }) => (
            <div className="not-prose my-6">
              <pre className="bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 rounded-xl overflow-x-auto">
                {children}
              </pre>
            </div>
          ),
          code: ({ children, className }) => {
            const isInline = !String(children).endsWith("\n") && !className;
            if (isInline) {
              return (
                <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded text-[0.875em] font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block p-5 text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
