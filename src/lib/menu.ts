import { prisma } from "./prisma";

export async function bumpMenuVersion(restaurantId: string) {
  return prisma.restaurant.update({
    where: { id: restaurantId },
    data: { menuVersion: { increment: 1 } },
    select: { menuVersion: true },
  });
}

export async function getPublicMenu(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            where: { available: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      dailySpecials: {
        where: { available: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!restaurant) return null;

  return {
    name: restaurant.name,
    slug: restaurant.slug,
    menuVersion: restaurant.menuVersion,
    categories: restaurant.categories.filter((c) => c.items.length > 0),
    dailySpecials: restaurant.dailySpecials,
  };
}

export function formatPrice(price: number | null | undefined) {
  if (price == null) return null;
  return Number.isInteger(price) ? `${price}€` : `${price.toFixed(2).replace(".", ",")}€`;
}
