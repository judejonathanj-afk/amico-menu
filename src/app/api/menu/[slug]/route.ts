import { NextResponse } from "next/server";
import { getPublicMenu } from "@/lib/menu";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { translateMenuServer } from "@/lib/i18n/translate-menu-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const menu = await getPublicMenu(slug);

  if (!menu) {
    return NextResponse.json({ error: "Menu introuvable" }, { status: 404 });
  }

  const localeParam = new URL(request.url).searchParams.get("locale");
  const locale: Locale =
    localeParam && isLocale(localeParam) ? localeParam : "fr";

  if (locale === "fr") {
    const clientVersion = request.headers.get("x-menu-version");
    if (clientVersion && Number(clientVersion) === menu.menuVersion) {
      return new NextResponse(null, { status: 304 });
    }
    return NextResponse.json(menu);
  }

  const translated = await translateMenuServer(menu, locale);
  return NextResponse.json(translated, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
