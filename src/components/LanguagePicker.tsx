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
  onLocaleChange?: (locale: Locale) => void;
};

/**
 * Native <select> stretched over the visible label — opens the OS language
 * picker on iPhone/Android (custom buttons/menus often ignore touches).
 */
export function LanguagePicker({ slug, locale, onLocaleChange }: Props) {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  function handleChange(code: string) {
    if (!isLocale(code)) return;
    if (onLocaleChange) {
      onLocaleChange(code);
      return;
    }
    window.location.assign(menuHref(slug, code));
  }

  return (
    <div className="relative z-[200] mx-auto mt-2 mb-1 flex w-full max-w-xs justify-center px-2 pointer-events-auto">
      <label className="relative inline-flex min-h-[48px] w-full max-w-[14rem] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/50 bg-white/30 px-4 py-2.5 text-sm font-semibold text-white shadow-sm touch-manipulation">
        <span
          className="pointer-events-none text-lg leading-none select-none"
          aria-hidden
        >
          {current.flag}
        </span>
        <span className="pointer-events-none select-none">{current.label}</span>
        <span className="pointer-events-none text-xs opacity-90 select-none">
          ▼
        </span>
        <select
          value={locale}
          onChange={(e) => handleChange(e.target.value)}
          aria-label={tUi("tapLanguage", locale)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={{ WebkitAppearance: "none", appearance: "none", fontSize: 16 }}
        >
          {LOCALES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
