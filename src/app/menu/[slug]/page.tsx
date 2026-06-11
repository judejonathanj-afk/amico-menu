import { MenuView } from "@/components/MenuView";
import { MenuLiveSync } from "@/components/MenuLiveSync";
import { getPublicMenu } from "@/lib/menu";
import { translateMenuServer } from "@/lib/i18n/translate-menu-server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;

  const frenchMenu = await getPublicMenu(slug);
  if (!frenchMenu) {
    notFound();
  }

  const locale: Locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE;
  const displayMenu =
    locale === "fr"
      ? frenchMenu
      : await translateMenuServer(frenchMenu, locale);

  return (
    <>
      <MenuView slug={slug} locale={locale} menu={displayMenu} />
      <MenuLiveSync slug={slug} menuVersion={frenchMenu.menuVersion} />
    </>
  );
}
