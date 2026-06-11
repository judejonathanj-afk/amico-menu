import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";

function menuHref(slug: string, code: Locale): string {
  if (code === "fr") return `/menu/${slug}`;
  return `/menu/${slug}/${code}`;
}

type Props = {
  slug: string;
  locale: Locale;
};

/** Plain links — full page load, no JavaScript required (reliable on iPhone). */
export function LanguagePicker({ slug, locale }: Props) {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative z-[300] mx-auto mt-2 mb-1 w-full max-w-sm px-2 pointer-events-auto">
      <p className="mb-2 text-center text-xs font-medium text-blue-100">
        {current.flag} {current.label}
      </p>
      <nav
        aria-label={tUi("tapLanguage", locale)}
        className="flex flex-wrap justify-center gap-2"
      >
        {LOCALES.map((lang) => {
          const active = locale === lang.code;
          return (
            <a
              key={lang.code}
              href={menuHref(slug, lang.code)}
              title={lang.label}
              aria-label={lang.label}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full px-3 text-xl no-underline touch-manipulation active:scale-95 ${
                active
                  ? "bg-white text-[#2563eb] shadow-lg ring-2 ring-white"
                  : "border-2 border-white/60 bg-white/25 text-white"
              }`}
            >
              {lang.flag}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
