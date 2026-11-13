import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FOOD_CATEGORIES = [
  {
    name: "Antipasti",
    sortOrder: 1,
    items: [
      { name: "Aubergines gratinées Parmigiana", price: 10 },
      { name: "Burrata des Pouilles et tomates", price: 12 },
      { name: "Carpaccio de bresaola", price: 13 },
      { name: "Vitello all tonato", price: 12 },
      {
        name: "Jambon de Parme croustini ail doux",
        price: 14,
      },
      { name: "Antipasti mixte", price: 11 },
      { name: "Velouté ou minestrone du Jour", price: 10 },
      { name: "Aranchini du moment", price: 10 },
    ],
  },
  {
    name: "Pasta di Roma",
    sortOrder: 2,
    items: [
      {
        name: "Amatriciana",
        description: "guanciale, tomate, pecorino",
        price: 17,
      },
      {
        name: "Carbonara",
        description: "oeuf, guanciale, parmesan",
        price: 17,
      },
      {
        name: "Cacio e pepe",
        description: "pecorino romano, poivre noir",
        price: 16,
      },
    ],
  },
  {
    name: "Spécialités",
    sortOrder: 3,
    items: [
      {
        name: "Raviolis ricotta et épinard",
        description: "crème de truffe",
        price: 22,
      },
      {
        name: "Linguinis boscaiola",
        description: "champignons, ail, persil",
        price: 19,
      },
      {
        name: "Linguinis en piperade",
        description: "Gambas, St Jacques",
        price: 22,
      },
      { name: "Risotto du moment", price: 22 },
    ],
  },
  {
    name: "Les plats",
    sortOrder: 4,
    items: [
      { name: "Osso bucco à la napolitaine", price: 22 },
      { name: "Cocotte de boeuf Bourguignon", price: 21 },
      { name: "Carré de porc aux lentilles", price: 19 },
    ],
  },
];

async function main() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "amico" },
    include: { categories: true },
  });

  if (!restaurant) {
    throw new Error("Restaurant amico introuvable");
  }

  const removeNames = new Set([
    "Entrées",
    "Pasta di Roma",
    "Spécialités",
    "Viandes",
    "Antipasti",
    "Les plats",
  ]);

  const toDelete = restaurant.categories.filter((c) => {
    if (c.groupLabel === "Vins & boissons") return false;
    if (c.name === "Desserts") return false;
    if (c.name === "A partager") return false;
    return removeNames.has(c.name);
  });

  for (const cat of toDelete) {
    await prisma.category.delete({ where: { id: cat.id } });
    console.log("Supprimé:", cat.name);
  }

  for (const cat of FOOD_CATEGORIES) {
    await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: cat.name,
        sortOrder: cat.sortOrder,
        items: {
          create: cat.items.map((item, i) => ({
            name: item.name,
            description: item.description ?? null,
            price: item.price,
            sortOrder: i,
          })),
        },
      },
    });
    console.log("Créé:", cat.name, `(${cat.items.length} plats)`);
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { menuVersion: { increment: 1 } },
  });

  console.log("\nMenu food mis à jour pour Amico");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
