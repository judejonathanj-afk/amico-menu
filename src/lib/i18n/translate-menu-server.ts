import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "./locales";
import { MYMEMORY_LANG } from "./locales";
import { translateCatalog } from "./catalog";
import { tUi } from "./ui";

const cache = new Map<string, string>();

async function translateOne(text: string, locale: Locale): Promise<string> {
  if (!text.trim() || locale === "fr") return text;

  const cacheKey = `${locale}:${text}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const fromCatalog = translateCatalog(text, locale);
  if (fromCatalog) {
    cache.set(cacheKey, fromCatalog);
    return fromCatalog;
  }

  const target = MYMEMORY_LANG[locale];
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${target}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    const translated = data?.responseData?.translatedText?.trim() || text;
    cache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

async function translateBatch(
  texts: string[],
  locale: Locale
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(texts.filter(Boolean))];

  await Promise.all(
    unique.map(async (text) => {
      map.set(text, await translateOne(text, locale));
    })
  );

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

export async function translateMenuServer(
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
