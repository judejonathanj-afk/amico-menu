import { MenuShell } from "@/components/MenuShell";
import { MenuLiveSync } from "@/components/MenuLiveSync";
import { getPublicMenu } from "@/lib/menu";
import { translateMenuSync } from "@/lib/i18n/translate-menu-sync";
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
  const initialMenu =
    locale === "fr" ? frenchMenu : translateMenuSync(frenchMenu, locale);

  return (
    <>
      <MenuShell
        slug={slug}
        initialLocale={locale}
        frenchMenu={frenchMenu}
        initialMenu={initialMenu}
      />
      <MenuLiveSync slug={slug} menuVersion={frenchMenu.menuVersion} />
    </>
  );
}
