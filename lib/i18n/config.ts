export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
  },
];

export const defaultLanguage = "en";

export function isValidLanguage(lang: string): boolean {
  return languages.some((l) => l.code === lang);
}

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}

