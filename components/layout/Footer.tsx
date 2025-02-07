import Link from "next/link";
import { Profile } from "@/lib/i18n/content-loader";

interface FooterProps {
  profile: Profile;
  translations: {
    allRightsReserved: string;
  };
}

export function Footer({ profile, translations }: FooterProps) {
  const { socialLinks } = profile;

  return (
    <footer className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} {profile.personalInfo.name}.{" "}
            {translations.allRightsReserved}
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-w-full">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="hover:underline text-sm whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

