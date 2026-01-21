"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CVDownloadButton } from "@/components/shared/CVDownloadButton";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { RadioIcon } from "@/components/shared/RadioIcon";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import type { Profile } from "@/lib/i18n/content-loader";

interface HeaderProps {
  profile: Profile;
  translations: {
    downloadCV: string;
  };
  language?: string;
}

export function Header({
  profile: profileData,
  translations,
  language,
}: HeaderProps) {
  const { name, position, about, company, cv, imageUrl, callsign } =
    profileData.personalInfo;

  return (
    <header className="bg-slate-900 dark:bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-end items-center gap-4 mb-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">{name}</h1>
            {callsign && (
              <div className="flex items-center gap-2 text-lg md:text-xl text-slate-400 dark:text-slate-400 font-mono">
                <RadioIcon color="currentColor" size={24} />
                {callsign}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-semibold">
              {position}
              {company && company.trim() !== "" && (
                <span className="text-xl md:text-2xl text-slate-300 dark:text-muted-foreground">
                  {" "}
                  @{company}
                </span>
              )}
            </h2>
            <p className="text-lg md:text-xl text-slate-300 dark:text-muted-foreground">
              {about}
            </p>
            {cv?.url && cv?.fileName && (
              <CVDownloadButton
                url={cv.url}
                fileName={cv.fileName}
                label={translations.downloadCV}
                language={language}
                className="mt-4"
              />
            )}
          </div>
          <div className="flex justify-center">
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-slate-700/50 dark:border-border shadow-xl">
              <OptimizedImage
                src={imageUrl}
                alt={`${name} - ${position} profile photo`}
                fill
                sizes="300px"
                className="hover:scale-105 transition-transform duration-300"
                priority
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
