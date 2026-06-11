import { renderMenuPage } from "@/lib/menu-page";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MenuLangPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === DEFAULT_LOCALE) {
    redirect(`/menu/${slug}`);
  }

  return renderMenuPage(slug, lang as Locale);
}
