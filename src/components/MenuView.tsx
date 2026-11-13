import type { ReactNode } from "react";
import { PriceDisplay } from "./PriceDisplay";
import { CategoryIcon } from "./CategoryIcon";
import { LanguagePicker } from "./LanguagePicker";
import { MenuCategoryNav } from "./MenuCategoryNav";
import type { Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";
import type { MenuData, MenuItem } from "@/lib/menu-types";

function MenuBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="menu-bg-image absolute inset-[-8%] sm:inset-[-5%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#eff6ff]/80 via-[#f8fafc]/92 to-[#f5f8ff]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#2563eb]/10 to-transparent" />
      <div className="absolute -bottom-8 -right-10 h-40 w-40 rounded-full bg-[#c8102e]/10 blur-2xl" />
      <div className="absolute bottom-10 right-8 h-24 w-24 rounded-full bg-[#009246]/15 blur-xl" />
    </div>
  );
}

function sectionId(label: string) {
  return `section-${label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

function DishRow({
  item,
  glassLabel,
}: {
  item: MenuItem | { id: string; name: string; description: string | null; price: number | null };
  glassLabel?: string;
}) {
  const withSecondary = "priceSecondary" in item ? item : null;

  return (
    <li className="flex items-start justify-between gap-3 border-b border-stone-100 py-3.5 last:border-b-0 sm:py-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug text-stone-900">{item.name}</p>
        {item.description && (
          <p className="mt-0.5 text-sm italic leading-snug text-stone-500">
            {item.description}
          </p>
        )}
      </div>
      <PriceDisplay
        price={item.price}
        priceSecondary={withSecondary?.priceSecondary}
        priceSecondaryLabel={withSecondary?.priceSecondaryLabel}
        glassLabel={glassLabel}
        className="shrink-0 text-right text-base font-bold text-stone-900"
      />
    </li>
  );
}

type Props = {
  slug: string;
  locale: Locale;
  menu: MenuData;
};

export function MenuView({ slug, locale, menu }: Props) {
  const dailyLabel = tUi("dailySpecials", locale);
  const drinksGroup = "Vins & boissons";

  const foodCategories = menu.categories.filter(
    (c) => c.groupLabel !== drinksGroup
  );
  const drinkCategories = menu.categories.filter(
    (c) => c.groupLabel === drinksGroup
  );

  const navItems: { id: string; label: string; icon: string }[] = [];

  if (menu.dailySpecials.length > 0) {
    navItems.push({
      id: sectionId(dailyLabel),
      label: dailyLabel,
      icon: "🥗",
    });
  }

  for (const cat of foodCategories) {
    navItems.push({
      id: sectionId(cat.name),
      label: cat.name,
      icon: iconFor(cat.name),
    });
  }

  if (drinkCategories.length > 0) {
    navItems.push({
      id: sectionId(tUi("drinks", locale)),
      label: tUi("drinks", locale),
      icon: "🥂",
    });
  }

  return (
    <div
      className="relative min-h-[100dvh] text-stone-900"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <MenuBackground />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <header className="sticky top-0 z-50 -mx-4 mb-1 flex items-center justify-end bg-[#f5f8ff]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
            <div className="pointer-events-auto flex flex-col items-center text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-stone-500">
                {tUi("restaurantType", locale)}
              </p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <h1 className="font-serif text-2xl leading-none tracking-wide text-[#2563eb] uppercase sm:text-3xl">
                  {menu.name}
                </h1>
                <img
                  src="/amico-logo.png"
                  alt="Amico"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-black/10"
                />
              </div>
              <div
                className="mt-1.5 h-[3px] w-14 overflow-hidden rounded-full"
                aria-hidden
              >
                <div className="flex h-full w-full">
                  <span className="flex-1 bg-[#009246]" />
                  <span className="flex-1 bg-white" />
                  <span className="flex-1 bg-[#ce2b37]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <LanguagePicker slug={slug} locale={locale} />
          </div>
        </header>

        <MenuCategoryNav items={navItems} />

        <main id="carte" className="mt-4 space-y-5 sm:mt-6 sm:space-y-6">
          {menu.dailySpecials.length > 0 && (
            <MenuSection
              id={sectionId(dailyLabel)}
              title={dailyLabel}
              icon="🥗"
              locale={locale}
            >
              <ul>
                {menu.dailySpecials.map((item) => (
                  <DishRow key={item.id} item={item} />
                ))}
              </ul>
            </MenuSection>
          )}

          {foodCategories.map((category) => (
            <MenuSection
              key={category.id}
              id={sectionId(category.name)}
              title={category.name}
              icon={iconFor(category.name)}
              locale={locale}
            >
              <ul>
                {category.items.map((item) => (
                  <DishRow
                    key={item.id}
                    item={item}
                    glassLabel={tUi("glass", locale)}
                  />
                ))}
              </ul>
            </MenuSection>
          ))}

          {drinkCategories.length > 0 && (
            <MenuSection
              id={sectionId(tUi("drinks", locale))}
              title={tUi("drinks", locale)}
              icon="🥂"
              locale={locale}
            >
              {drinkCategories.map((category) => (
                <div key={category.id} className="mb-4 last:mb-0">
                  <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#2563eb]">
                    <CategoryIcon name={category.name} />
                    {category.name}
                  </h3>
                  <ul>
                    {category.items.map((item) => (
                      <DishRow
                        key={item.id}
                        item={item}
                        glassLabel={tUi("glass", locale)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </MenuSection>
          )}
        </main>

        <footer className="mt-8 flex justify-center pb-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/90 px-4 py-2 text-xs text-stone-600 shadow-sm backdrop-blur-sm">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-[10px] font-bold text-white"
              aria-hidden
            >
              i
            </span>
            {tUi("authenticity", locale)}
            <span aria-hidden>❤️</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

function MenuSection({
  id,
  title,
  icon,
  children,
  locale,
}: {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-[0_12px_40px_rgba(37,99,235,0.08)] backdrop-blur-sm sm:p-6"
    >
      <h2 className="mb-2 flex items-center gap-2 font-serif text-xl font-semibold text-[#2563eb] sm:text-2xl">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      <div className="mb-3 h-px w-full bg-gradient-to-r from-[#009246] via-white to-[#ce2b37] opacity-70" />
      {children}
      <p className="mt-3 text-center text-[11px] text-stone-400">
        {tUi("liveMenu", locale)}
      </p>
    </section>
  );
}

function iconFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("antipasti") || n.includes("entrée")) return "🫒";
  if (n.includes("pasta") || n.includes("pâte")) return "🍝";
  if (n.includes("spécial") || n.includes("special")) return "⭐";
  if (n.includes("plat") || n.includes("viande") || n.includes("meat")) return "🥩";
  if (n.includes("dessert") || n.includes("dolci")) return "🍰";
  if (n.includes("partager") || n.includes("share")) return "🧀";
  if (n.includes("salade") || n.includes("pinsa") || n.includes("salad")) return "🥗";
  if (n.includes("rouge") || n.includes("red")) return "🍷";
  if (n.includes("blanc") || n.includes("white")) return "🥂";
  if (n.includes("rosé") || n.includes("rose")) return "🌸";
  if (n.includes("prosecco")) return "🥂";
  if (n.includes("cocktail")) return "🍸";
  if (n.includes("alcool") || n.includes("spirit")) return "🥃";
  if (n.includes("digest")) return "☕";
  return "🍽️";
}

