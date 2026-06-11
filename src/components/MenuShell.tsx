"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MenuView } from "./MenuView";
import type { MenuData } from "@/lib/menu-types";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { translateMenuSync } from "@/lib/i18n/translate-menu-sync";
import { readMenuCache, writeMenuCache } from "@/lib/i18n/menu-cache";

function resolveMenu(
  slug: string,
  frenchMenu: MenuData,
  locale: Locale
): MenuData {
  if (locale === "fr") return frenchMenu;
  const cached = readMenuCache(slug, locale, frenchMenu.menuVersion);
  if (cached) return cached;
  return translateMenuSync(frenchMenu, locale);
}

type Props = {
  slug: string;
  initialLocale: Locale;
  frenchMenu: MenuData;
  initialMenu: MenuData;
};

export function MenuShell({
  slug,
  initialLocale,
  frenchMenu,
  initialMenu,
}: Props) {
  const [locale] = useState(initialLocale);
  const [menu, setMenu] = useState(initialMenu);
  const localeRef = useRef(locale);
  const frenchMenuRef = useRef(frenchMenu);
  frenchMenuRef.current = frenchMenu;

  // Live menu sync: keep current language, only refresh menu content
  useEffect(() => {
    setMenu(resolveMenu(slug, frenchMenu, localeRef.current));
  }, [frenchMenu, slug]);

  const prefetchLocales = useCallback(() => {
    const version = frenchMenuRef.current.menuVersion;
    for (const { code } of LOCALES) {
      if (code === "fr") continue;
      if (readMenuCache(slug, code, version)) continue;
      fetch(`/api/menu/${slug}?locale=${code}`, { cache: "force-cache" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: MenuData | null) => {
          if (data) writeMenuCache(slug, code, version, data);
        })
        .catch(() => {});
    }
  }, [slug]);

  useEffect(() => {
    const timer = window.setTimeout(prefetchLocales, 400);
    return () => window.clearTimeout(timer);
  }, [prefetchLocales, frenchMenu.menuVersion]);

  return <MenuView slug={slug} locale={locale} menu={menu} />;
}
