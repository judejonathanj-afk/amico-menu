export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  priceSecondary: number | null;
  priceSecondaryLabel: string | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  groupLabel: string | null;
  items: MenuItem[];
};

export type DailySpecial = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
};

export type MenuData = {
  name: string;
  slug: string;
  menuVersion: number;
  categories: MenuCategory[];
  dailySpecials: DailySpecial[];
};
