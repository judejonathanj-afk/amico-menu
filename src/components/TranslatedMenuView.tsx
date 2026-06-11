"use client";

import { useEffect, useState } from "react";
import { MenuView } from "./MenuView";
import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  slug: string;
  locale: Locale;
  menu: MenuData;
};

export function TranslatedMenuView({ slug, locale, menu }: Props) {
  const [displayMenu, setDisplayMenu] = useState<MenuData | null>(
    locale === "fr" ? menu : null
  );
  const [loading, setLoading] = useState(locale !== "fr");

  useEffect(() => {
    if (locale === "fr") {
      setDisplayMenu(menu);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDisplayMenu(null);

    fetch(`/api/menu/${slug}?locale=${locale}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("translation failed");
        return res.json() as Promise<MenuData>;
      })
      .then((translated) => {
        if (!cancelled) {
          setDisplayMenu(translated);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDisplayMenu(menu);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, locale, menu]);

  if (loading || !displayMenu) {
    return (
      <div className="relative min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#2563eb]/55 to-white/92">
        <p className="text-stone-600 text-sm animate-pulse">
          {tUi("translating", locale)}
        </p>
      </div>
    );
  }

  return <MenuView slug={slug} locale={locale} menu={displayMenu} />;
}
