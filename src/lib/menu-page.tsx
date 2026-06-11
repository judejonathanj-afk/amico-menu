import { MenuView } from "@/components/MenuView";
import { MenuLiveSync } from "@/components/MenuLiveSync";
import { getPublicMenu } from "@/lib/menu";
import { translateMenuServer } from "@/lib/i18n/translate-menu-server";
import { translateMenuSync } from "@/lib/i18n/translate-menu-sync";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function renderMenuPage(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const frenchMenu = await getPublicMenu(slug);
  if (!frenchMenu) {
    notFound();
  }

  const menu =
    locale === "fr"
      ? frenchMenu
      : await translateMenuServer(frenchMenu, locale).catch(() =>
          translateMenuSync(frenchMenu, locale)
        );

  return (
    <>
      <MenuView slug={slug} locale={locale} menu={menu} />
      <MenuLiveSync slug={slug} menuVersion={frenchMenu.menuVersion} />
    </>
  );
}
