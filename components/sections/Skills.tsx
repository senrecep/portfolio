"use client";

interface SkillsProps {
  skills: string[];
  translations: {
    title: string;
  };
}

export function Skills({ skills, translations }: SkillsProps) {
  // If there are no skills, don't render anything
  if (!skills?.length) {
    return null;
  }

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {translations.title}
        </h2>
      </div>

      <div className="mx-auto max-w-[64rem]">
        <div className="flex flex-wrap gap-2 justify-center">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-accent transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

