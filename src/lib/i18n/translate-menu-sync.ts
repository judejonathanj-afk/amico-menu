import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "./locales";
import { translateCatalog } from "./catalog";
import { tUi } from "./ui";

function tr(text: string | null, locale: Locale): string | null {
  if (!text) return null;
  if (locale === "fr") return text;
  return translateCatalog(text, locale) ?? text;
}

function trLabel(label: string | null, locale: Locale): string | null {
  if (!label) return null;
  if (label === "bouteille") return tUi("bottle", locale);
  if (label === "verre") return tUi("glass", locale);
  return label;
}

/** Traduction instantanée côté téléphone — sans appel réseau */
export function translateMenuSync(menu: MenuData, locale: Locale): MenuData {
  if (locale === "fr") return menu;

  return {
    ...menu,
    categories: menu.categories.map((cat) => ({
      ...cat,
      name: tr(cat.name, locale) ?? cat.name,
      groupLabel: tr(cat.groupLabel, locale),
      items: cat.items.map((item) => ({
        ...item,
        name: tr(item.name, locale) ?? item.name,
        description: tr(item.description, locale),
        priceSecondaryLabel: trLabel(item.priceSecondaryLabel, locale),
      })),
    })),
    dailySpecials: menu.dailySpecials.map((s) => ({
      ...s,
      name: tr(s.name, locale) ?? s.name,
      description: tr(s.description, locale),
    })),
  };
}
