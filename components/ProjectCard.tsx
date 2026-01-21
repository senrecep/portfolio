"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { trackExternalLink } from "@/lib/analytics";
import type { Project } from "@/lib/i18n/content-loader";

interface ProjectCardProps {
  project: Project;
  translations: {
    tags: string;
    viewProject: string;
  };
}

export function ProjectCard({ project, translations }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  const shouldShowImage = project.imageUrl && !imageError;

  return (
    <Card className="overflow-hidden flex flex-col w-full group">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {shouldShowImage && (
              <div className="relative w-8 h-8 flex-shrink-0 p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <OptimizedImage
                  src={project.imageUrl!}
                  alt={`${project.title} project icon`}
                  fill
                  sizes="32px"
                  objectFit="contain"
                  showLoadingSpinner={false}
                  onErrorCallback={() => setImageError(true)}
                />
              </div>
            )}
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-7">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium glass-subtle text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-all duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 group/link"
              onClick={() =>
                trackExternalLink(
                  project.projectUrl!,
                  `Project: ${project.title}`,
                )
              }
            >
              {translations.viewProject}
              <ExternalLink className="h-4 w-4 ml-2 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
