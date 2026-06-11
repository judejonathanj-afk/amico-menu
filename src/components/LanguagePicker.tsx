"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
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

export function LanguagePicker({ slug, locale, onLocaleChange }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  function selectLanguage(code: Locale) {
    close();
    if (onLocaleChange) {
      onLocaleChange(code);
      return;
    }
    window.location.assign(menuHref(slug, code));
  }

  const sheet =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-[9998] bg-black/50 touch-manipulation"
              onClick={close}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={tUi("tapLanguage", locale)}
              className="fixed inset-x-0 bottom-0 z-[9999] rounded-t-2xl border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-stone-300" />
              <p className="text-center text-sm font-medium text-stone-700 mb-3">
                {tUi("tapLanguage", locale)}
              </p>
              <ul className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                {LOCALES.map((lang) => {
                  const active = locale === lang.code;
                  return (
                    <li key={lang.code}>
                      <button
                        type="button"
                        onClick={() => selectLanguage(lang.code)}
                        className={`flex w-full min-h-[56px] items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium touch-manipulation ${
                          active
                            ? "bg-[#2563eb] text-white"
                            : "bg-stone-100 text-stone-800 active:bg-blue-100"
                        }`}
                      >
                        <span className="text-2xl leading-none">{lang.flag}</span>
                        <span className="leading-tight text-left">
                          {lang.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div className="relative z-[100] mx-auto mt-2 mb-1 w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="language-picker-trigger flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/50 bg-white/30 px-4 py-2.5 text-sm font-semibold text-white shadow-sm min-h-[48px] touch-manipulation"
      >
        <span className="text-lg">{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs opacity-90">▼</span>
      </button>
      {sheet}
    </div>
  );
}
