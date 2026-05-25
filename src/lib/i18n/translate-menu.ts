import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "./locales";
import { translateCatalog } from "./catalog";
import { tUi } from "./ui";

export type { MenuData };

const clientCache = new Map<string, string>();

async function translateBatch(texts: string[], locale: Locale): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (locale === "fr") {
    texts.forEach((t) => map.set(t, t));
    return map;
  }

  const needApi: string[] = [];

  for (const text of texts) {
    if (!text) continue;
    const key = `${locale}:${text}`;
    if (clientCache.has(key)) {
      map.set(text, clientCache.get(key)!);
      continue;
    }
    const catalog = translateCatalog(text, locale);
    if (catalog) {
      map.set(text, catalog);
      clientCache.set(key, catalog);
      continue;
    }
    needApi.push(text);
  }

  if (needApi.length > 0) {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, texts: needApi }),
    });
    if (res.ok) {
      const data = await res.json();
      needApi.forEach((text, i) => {
        const translated = data.translations[i] ?? text;
        map.set(text, translated);
        clientCache.set(`${locale}:${text}`, translated);
      });
    } else {
      needApi.forEach((text) => map.set(text, text));
    }
  }

  texts.forEach((t) => {
    if (t && !map.has(t)) map.set(t, t);
  });

  return map;
}

function tr(map: Map<string, string>, text: string | null): string | null {
  if (!text) return null;
  return map.get(text) ?? text;
}

function trLabel(label: string | null, locale: Locale): string | null {
  if (!label) return null;
  if (label === "bouteille") return tUi("bottle", locale);
  if (label === "verre") return tUi("glass", locale);
  return label;
}

export async function translateMenu(
  menu: MenuData,
  locale: Locale
): Promise<MenuData> {
  if (locale === "fr") return menu;

  const unique = new Set<string>();
  for (const cat of menu.categories) {
    unique.add(cat.name);
    if (cat.groupLabel) unique.add(cat.groupLabel);
    for (const item of cat.items) {
      unique.add(item.name);
      if (item.description) unique.add(item.description);
    }
  }
  for (const s of menu.dailySpecials) {
    unique.add(s.name);
    if (s.description) unique.add(s.description);
  }

  const map = await translateBatch([...unique], locale);

  return {
    ...menu,
    categories: menu.categories.map((cat) => ({
      ...cat,
      name: tr(map, cat.name) ?? cat.name,
      groupLabel: tr(map, cat.groupLabel),
      items: cat.items.map((item) => ({
        ...item,
        name: tr(map, item.name) ?? item.name,
        description: tr(map, item.description),
        priceSecondaryLabel: trLabel(item.priceSecondaryLabel, locale),
      })),
    })),
    dailySpecials: menu.dailySpecials.map((s) => ({
      ...s,
      name: tr(map, s.name) ?? s.name,
      description: tr(map, s.description),
    })),
  };
}
