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

/** Compact language control — native details + links (works without JS on iPhone). */
export function LanguagePicker({ slug, locale }: Props) {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <details className="language-picker group relative z-[300]">
      <summary
        aria-label={tUi("chooseLanguage", locale)}
        className="language-picker-trigger flex cursor-pointer list-none items-center gap-2 rounded-full border border-stone-200/80 bg-white/90 px-3 py-2 text-sm font-medium text-[#2563eb] shadow-sm backdrop-blur-sm [&::-webkit-details-marker]:hidden"
      >
        <span className="text-base leading-none" aria-hidden>
          {current.flag}
        </span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className="h-3.5 w-3.5 text-stone-400 transition group-open:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <nav
        aria-label={tUi("tapLanguage", locale)}
        className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1 shadow-xl"
      >
        {LOCALES.map((lang) => {
          const active = locale === lang.code;
          return (
            <a
              key={lang.code}
              href={menuHref(slug, lang.code)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm no-underline transition-colors ${
                active
                  ? "bg-[#2563eb]/8 font-semibold text-[#2563eb]"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {lang.flag}
              </span>
              {lang.label}
            </a>
          );
        })}
      </nav>
    </details>
  );
}
