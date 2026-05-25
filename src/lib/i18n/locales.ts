export const LOCALES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

export const MYMEMORY_LANG: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  de: "de",
  ar: "ar",
  it: "it",
  es: "es",
  sv: "sv",
  pt: "pt",
  nl: "nl",
  ru: "ru",
};
