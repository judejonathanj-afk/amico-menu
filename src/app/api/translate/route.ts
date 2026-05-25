import { NextResponse } from "next/server";
import { MYMEMORY_LANG, type Locale } from "@/lib/i18n/locales";
import { translateCatalog } from "@/lib/i18n/catalog";

const cache = new Map<string, string>();

async function translateOne(text: string, locale: Locale): Promise<string> {
  if (!text.trim() || locale === "fr") return text;

  const cached = cache.get(`${locale}:${text}`);
  if (cached) return cached;

  const fromCatalog = translateCatalog(text, locale);
  if (fromCatalog) {
    cache.set(`${locale}:${text}`, fromCatalog);
    return fromCatalog;
  }

  const target = MYMEMORY_LANG[locale];
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${target}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const translated =
      data?.responseData?.translatedText?.trim() || text;
    cache.set(`${locale}:${text}`, translated);
    return translated;
  } catch {
    return text;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const texts = (body.texts as string[]) ?? [];
  const locale = body.locale as Locale;

  if (!locale || locale === "fr") {
    return NextResponse.json({ translations: texts });
  }

  const unique = [...new Set(texts.filter(Boolean))];
  const map: Record<string, string> = {};

  await Promise.all(
    unique.map(async (text) => {
      map[text] = await translateOne(text, locale);
    })
  );

  const translations = texts.map((t) => map[t] ?? t);
  return NextResponse.json({ translations });
}
