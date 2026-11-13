type NavItem = {
  id: string;
  label: string;
  icon: string;
};

type Props = {
  items: NavItem[];
};

export function MenuCategoryNav({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Catégories du menu"
      className="sticky top-[4.5rem] z-40 -mx-1 overflow-x-auto px-1 pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2 pb-1">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`flex items-center gap-2 whitespace-nowrap rounded-2xl border px-3.5 py-2.5 text-sm font-medium no-underline shadow-sm backdrop-blur-md transition active:scale-[0.98] ${
                index === 0
                  ? "border-[#1a3c34] bg-[#1a3c34] text-white shadow-[0_8px_20px_rgba(26,60,52,0.25)]"
                  : "border-white/70 bg-white/85 text-stone-700"
              }`}
            >
              <span className="text-base leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
