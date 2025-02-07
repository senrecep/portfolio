import { Profile } from "@/lib/i18n/content-loader";

interface FooterProps {
  profile: Profile;
  translations: {
    allRightsReserved: string;
  };
}

export function Footer({ profile, translations }: FooterProps) {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            {profile.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-slate-50 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-slate-300 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} {profile.personalInfo.name}.{" "}
            {translations.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}

