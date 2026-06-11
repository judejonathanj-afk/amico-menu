import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FOOD_CATEGORIES = [
  {
    name: "Entrées",
    sortOrder: 1,
    items: [
      { name: "Burrata des fouilles et tomates", price: 12 },
      {
        name: "Salade Del Mar",
        description: "poulpe, calamar, crevette",
        price: 14,
      },
      {
        name: "Carpaccio de bresaola",
        description: "roquette, parmesan",
        price: 13,
      },
      {
        name: "Jambon de parme",
        description: "(vitello) croustini ail doux",
        price: 15,
      },
      {
        name: "Antipasti mixte",
        description: "légumes grillés, stracciatella",
        price: 12,
      },
      {
        name: "Arancini",
        description: "boulette de riz, boeuf, sauce tomate",
        price: 12,
      },
      {
        name: "Salade caprese de bufala 125g",
        description: "roquette, tomates, huile d'olive",
        price: 12,
      },
      { name: "Vitello al Tonato", price: 14 },
    ],
  },
  {
    name: "Pasta di Roma",
    sortOrder: 2,
    items: [
      {
        name: "Amatriciana",
        description: "guanciale, tomate, pecorino romano",
        price: 17,
      },
      {
        name: "Carbonara",
        description: "paccheri, oeuf, guanciale, parmesan",
        price: 17,
      },
      {
        name: "Caccio e pepe",
        description: "paccheri, pecorino romano poivre noir",
        price: 16,
      },
    ],
  },
  {
    name: "Spécialités",
    sortOrder: 3,
    items: [
      {
        name: "Raviolis ricotta et épinards",
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
      { name: "Cavatapis aux figues et foie gras", price: 22 },
      { name: "Poulpe à la luciana", price: 28 },
    ],
  },
  {
    name: "Viandes",
    sortOrder: 4,
    items: [
      { name: "Milanaise de Veau à la Sauge", price: 28 },
      { name: "Tartare à l'italienne", price: 19 },
    ],
  },
];

const DESSERTS = {
  name: "Desserts",
  sortOrder: 5,
  items: [
    { name: "Tiramisu café & cacao", price: 9 },
    {
      name: "Baba au rhum",
      description: "chantilly mascarpone, gousses de vanille",
      price: 9,
    },
    {
      name: "Panna cotta",
      description: "fruits rouges, pistache concassée",
      price: 9,
    },
  ],
};


async function main() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "amico" },
    include: { categories: true },
  });

  if (!restaurant) {
    throw new Error("Restaurant amico introuvable");
  }

  const toDelete = restaurant.categories.filter((c) => {
    if (c.groupLabel === "Vins & boissons") return false;
    if (c.name === "Desserts") return false;
    if (c.name === "A partager") return false;
    return true;
  });

  for (const cat of toDelete) {
    await prisma.category.delete({ where: { id: cat.id } });
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
  }

  const hasDesserts = restaurant.categories.some((c) => c.name === "Desserts");
  if (!hasDesserts) {
    await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: DESSERTS.name,
        sortOrder: DESSERTS.sortOrder,
        items: {
          create: DESSERTS.items.map((item, i) => ({
            name: item.name,
            description: item.description ?? null,
            price: item.price,
            sortOrder: i,
          })),
        },
      },
    });
    console.log("Section Desserts restaurée");
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { menuVersion: { increment: 1 } },
  });

  console.log("Menu food mis à jour pour Amico");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
