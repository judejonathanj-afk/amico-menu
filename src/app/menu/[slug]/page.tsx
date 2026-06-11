import { TranslatedMenuView } from "@/components/TranslatedMenuView";
import { MenuLiveSync } from "@/components/MenuLiveSync";
import { getPublicMenu } from "@/lib/menu";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  return (
    <>
      <TranslatedMenuView slug={slug} locale={locale} menu={frenchMenu} />
      <MenuLiveSync slug={slug} menuVersion={frenchMenu.menuVersion} />
    </>
  );
}
