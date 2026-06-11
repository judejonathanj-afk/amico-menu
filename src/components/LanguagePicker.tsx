import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";

function menuHref(slug: string, code: Locale): string {
  if (code === "fr") return `/menu/${slug}`;
  return `/menu/${slug}?lang=${code}`;
}

type Props = {
  slug: string;
  locale: Locale;
};

/**
 * Direct links per language — works on iPhone without JavaScript.
 * Native <select> on iOS often changes display without firing onChange.
 */
export function LanguagePicker({ slug, locale }: Props) {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="mx-auto mt-2 mb-1 w-full max-w-sm px-2">
      <p className="mb-1.5 text-center text-xs text-blue-100/90">
        {current.flag} {current.label}
      </p>
      <nav
        aria-label={tUi("tapLanguage", locale)}
        className="flex justify-center gap-1.5 overflow-x-auto py-0.5 [-webkit-overflow-scrolling:touch]"
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
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl no-underline touch-manipulation ${
                active
                  ? "bg-white text-[#2563eb] shadow-md ring-2 ring-white/90"
                  : "border border-white/40 bg-white/20 text-white"
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
