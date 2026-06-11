"use client";

import { useEffect, useState } from "react";
import { MenuView } from "./MenuView";
import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "@/lib/i18n/locales";
import { readMenuCache, writeMenuCache } from "@/lib/i18n/menu-cache";

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
  const [menu, setMenu] = useState(initialMenu);

  useEffect(() => {
    if (initialLocale === "fr") {
      setMenu(frenchMenu);
      return;
    }

    const version = frenchMenu.menuVersion;
    const cached = readMenuCache(slug, initialLocale, version);
    if (cached) {
      setMenu(cached);
      return;
    }

    setMenu(initialMenu);

    let cancelled = false;
    fetch(`/api/menu/${slug}?locale=${initialLocale}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MenuData | null) => {
        if (cancelled || !data) return;
        writeMenuCache(slug, initialLocale, version, data);
        setMenu(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [initialLocale, initialMenu, frenchMenu, slug]);

  return <MenuView slug={slug} locale={initialLocale} menu={menu} />;
}
