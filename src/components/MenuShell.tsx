"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MenuView } from "./MenuView";
import type { MenuData } from "@/lib/menu-types";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { translateMenuSync } from "@/lib/i18n/translate-menu-sync";
import { readMenuCache, writeMenuCache } from "@/lib/i18n/menu-cache";

function menuPath(slug: string, locale: Locale) {
  return locale === "fr" ? `/menu/${slug}` : `/menu/${slug}?lang=${locale}`;
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
  const [locale, setLocale] = useState(initialLocale);
  const [menu, setMenu] = useState(initialMenu);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => {
    setLocale(initialLocale);
    setMenu(initialMenu);
  }, [initialLocale, initialMenu]);

  useEffect(() => {
    if (locale === "fr") {
      setMenu(frenchMenu);
      return;
    }
    const cached = readMenuCache(slug, locale, frenchMenu.menuVersion);
    if (cached) {
      setMenu(cached);
      return;
    }
    setMenu(translateMenuSync(frenchMenu, locale));
  }, [frenchMenu, locale, slug]);

  const changeLocale = useCallback(
    (next: Locale) => {
      if (next === localeRef.current) return;

      setLocale(next);
      window.history.replaceState(null, "", menuPath(slug, next));

      if (next === "fr") {
        setMenu(frenchMenu);
        return;
      }

      const cached = readMenuCache(slug, next, frenchMenu.menuVersion);
      if (cached) {
        setMenu(cached);
        return;
      }

      setMenu(translateMenuSync(frenchMenu, next));

      fetch(`/api/menu/${slug}?locale=${next}`, { cache: "force-cache" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: MenuData | null) => {
          if (!data || localeRef.current !== next) return;
          writeMenuCache(slug, next, frenchMenu.menuVersion, data);
          setMenu(data);
        })
        .catch(() => {});
    },
    [frenchMenu, slug]
  );

  useEffect(() => {
    const version = frenchMenu.menuVersion;
    const timer = window.setTimeout(() => {
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
    }, 400);
    return () => window.clearTimeout(timer);
  }, [slug, frenchMenu.menuVersion]);

  return (
    <MenuView locale={locale} menu={menu} onLocaleChange={changeLocale} />
  );
}
