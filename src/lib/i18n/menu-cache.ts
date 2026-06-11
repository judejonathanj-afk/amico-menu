import type { MenuData } from "@/lib/menu-types";
import type { Locale } from "./locales";

function cacheKey(slug: string, locale: Locale, version: number) {
  return `amico-menu:${slug}:${locale}:v${version}`;
}

export function readMenuCache(
  slug: string,
  locale: Locale,
  version: number
): MenuData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(slug, locale, version));
    return raw ? (JSON.parse(raw) as MenuData) : null;
  } catch {
    return null;
  }
}

export function writeMenuCache(
  slug: string,
  locale: Locale,
  version: number,
  menu: MenuData
) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(cacheKey(slug, locale, version), JSON.stringify(menu));
  } catch {
    // quota exceeded — ignore
  }
}
