import { PriceDisplay } from "./PriceDisplay";
import { CategoryIcon } from "./CategoryIcon";
import { LanguagePicker } from "./LanguagePicker";
import type { Locale } from "@/lib/i18n/locales";
import { tUi } from "@/lib/i18n/ui";
import type { MenuCategory, MenuData } from "@/lib/menu-types";

function MenuBackground() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="menu-bg-image absolute inset-[-8%] sm:inset-[-5%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2563eb]/55 via-white/70 to-white/92" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
    </div>
  );
}

const cardClass =
  "rounded-2xl border border-white/60 bg-white/88 backdrop-blur-md shadow-lg shadow-stone-900/5 p-5";

type Props = {
  locale: Locale;
  menu: MenuData;
  onLocaleChange?: (locale: Locale) => void;
};

export function MenuView({ locale, menu, onLocaleChange }: Props) {
  const grouped = menu.categories.reduce<Record<string, MenuCategory[]>>(
    (acc, cat) => {
      const key = cat.groupLabel ?? cat.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(cat);
      return acc;
    },
    {}
  );

  return (
    <div
      className="relative min-h-[100dvh] text-stone-900"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <MenuBackground />
      <div className="relative z-10">
        <header className="relative z-50 bg-[#2563eb]/95 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] text-center shadow-md isolate">
          <p className="text-[10px] uppercase tracking-[0.35em] text-blue-100 sm:text-[11px]">
            {tUi("restaurantType", locale)}
          </p>
          <h1 className="font-serif text-3xl tracking-wide text-white mt-1 sm:text-4xl">
            {menu.name}
          </h1>
          <LanguagePicker locale={locale} onLocaleChange={onLocaleChange} />
          <p className="text-sm text-blue-100/90 mt-1">
            {tUi("menuSubtitle", locale)}
          </p>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-lg px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-5 space-y-6 sm:px-5 sm:space-y-8">
          {menu.dailySpecials.length > 0 && (
            <section className={`${cardClass} border-[#2563eb]/25`}>
              <h2 className="font-bold text-xl text-[#2563eb] mb-4 flex items-center gap-2 sm:text-2xl">
                <CategoryIcon name="Plats du jour" />
                <span className="underline decoration-[#2563eb] decoration-2 underline-offset-4">
                  {tUi("dailySpecials", locale)}
                </span>
              </h2>
              <ul className="space-y-4">
                {menu.dailySpecials.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-stone-600 italic mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <PriceDisplay price={item.price} className="text-[#2563eb]" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Object.entries(grouped).map(([groupName, categories]) => (
            <section key={groupName}>
              {categories[0]?.groupLabel && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600/80 mb-2 px-1 sm:text-[11px]">
                  {groupName}
                </p>
              )}
              {categories.map((category) => (
                <div key={category.id} className={`${cardClass} mb-5`}>
                  <h2 className="font-bold text-lg text-[#2563eb] mb-4 flex items-center gap-2 sm:text-xl">
                    <CategoryIcon name={category.name} />
                    <span className="underline decoration-[#2563eb] decoration-2 underline-offset-4">
                      {category.name}
                    </span>
                  </h2>
                  <ul className="space-y-4 sm:space-y-5">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between gap-3 items-start"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug text-stone-900">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-sm text-stone-600 italic mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <PriceDisplay
                          price={item.price}
                          priceSecondary={item.priceSecondary}
                          priceSecondaryLabel={item.priceSecondaryLabel}
                          glassLabel={tUi("glass", locale)}
                          className="text-right shrink-0 text-[#2563eb]"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </main>

        <footer className="relative z-10 text-center text-xs text-stone-600/90 pb-6 px-4">
          <span className="inline-block rounded-full bg-white/75 px-4 py-1.5 backdrop-blur-sm">
            {tUi("liveMenu", locale)}
          </span>
        </footer>
      </div>
    </div>
  );
}
