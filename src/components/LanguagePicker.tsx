"use client";

import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

export function LanguagePicker({ locale, onLocaleChange }: Props) {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <details className="relative z-[100] mx-auto mt-2 mb-1 w-full max-w-xs group">
      <summary className="language-picker-summary flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-white/50 bg-white/30 px-4 py-2.5 text-sm font-semibold text-white shadow-sm min-h-[44px] touch-manipulation [&::-webkit-details-marker]:hidden">
        <span className="text-lg">{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs opacity-90">▼</span>
      </summary>

      <div className="absolute left-1/2 top-[calc(100%+6px)] z-[200] w-[min(100vw-2rem,20rem)] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl">
        <p className="text-center text-xs text-stone-500 px-2 py-1 mb-2">
          {tUi("tapLanguage", locale)}
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {LOCALES.map((lang) => {
            const active = locale === lang.code;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => onLocaleChange?.(lang.code)}
                  className={`flex w-full min-h-[48px] items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium touch-manipulation ${
                    active
                      ? "bg-[#2563eb] text-white"
                      : "bg-stone-100 text-stone-800 active:bg-blue-100"
                  }`}
                >
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <span className="leading-tight">{lang.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
