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

/** Visible native select + form submit — reliable on iPhone (invisible overlay often skips onChange). */
export function LanguagePicker({ slug, locale }: Props) {
  function navigateTo(code: string) {
    if (!isLocale(code) || code === locale) return;
    window.location.replace(menuHref(slug, code));
  }

  return (
    <div className="mx-auto mt-2 mb-1 flex w-full max-w-xs justify-center px-2">
      <form
        action={`/menu/${slug}`}
        method="get"
        className="w-full max-w-[14rem]"
        onSubmit={(e) => {
          e.preventDefault();
          const code = new FormData(e.currentTarget).get("lang");
          if (typeof code === "string") navigateTo(code);
        }}
      >
        <select
          key={locale}
          name="lang"
          defaultValue={locale}
          onChange={(e) => {
            const code = e.currentTarget.value;
            navigateTo(code);
          }}
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
      </form>
    </div>
  );
}
