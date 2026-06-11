"use client";

import { LOCALES, type Locale, isLocale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";

function menuHref(slug: string, code: Locale): string {
  if (code === "fr") return `/menu/${slug}`;
  return `/menu/${slug}?lang=${code}`;
}

type Props = {
  slug: string;
  locale: Locale;
};

export function LanguagePicker({ slug, locale }: Props) {
  function goTo(code: string) {
    if (!isLocale(code) || code === locale) return;
    window.location.href = menuHref(slug, code);
  }

  return (
    <div className="mx-auto mt-2 mb-1 flex w-full max-w-xs justify-center px-2">
      <label className="block w-full max-w-[14rem]">
        <span className="sr-only">{tUi("tapLanguage", locale)}</span>
        <select
          name="lang"
          value={locale}
          onChange={(e) => goTo(e.target.value)}
          aria-label={tUi("tapLanguage", locale)}
          className="language-select block h-11 w-full cursor-pointer rounded-full border border-white/50 bg-white/30 px-4 pr-8 text-center text-sm font-semibold text-white shadow-sm touch-manipulation"
          style={{ fontSize: 16 }}
        >
          {LOCALES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-stone-900">
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
