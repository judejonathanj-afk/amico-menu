import { renderMenuPage } from "@/lib/menu-page";
import { isLocale } from "@/lib/i18n/locales";
import { redirect } from "next/navigation";

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

  if (lang && isLocale(lang) && lang !== "fr") {
    redirect(`/menu/${slug}/${lang}`);
  }

  return renderMenuPage(slug, "fr");
}
