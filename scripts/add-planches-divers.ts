import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const A_PARTAGER = {
  name: "A partager",
  sortOrder: 6,
  items: [
    {
      name: "Planche de charcuterie",
      description: "2 personnes",
      price: 22,
    },
    {
      name: "Planche de fromages",
      description: "2 personnes",
      price: 22,
    },
    {
      name: "Planche mixte",
      description: "2 personnes",
      price: 22,
    },
    {
      name: "Jambon de Parme (culatello)",
      description: "1 personne",
      price: 15,
    },
    {
      name: "Focaccia ou pinsa",
      description: "Mortadelle truffée burrata roquette pesto",
      price: 12,
    },
    { name: "Salade de poulpe", price: 14 },
    { name: "Burrata des Pouilles", price: 12 },
    { name: "Carpaccio de bresaola", price: 13 },
    {
      name: "Antipasti",
      description: "légumes grillés",
      price: 12,
    },
    { name: "Poivrons grillés mozzarella", price: 14 },
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

  for (const oldName of ["Planches", "Divers", "A partager"]) {
    const existing = restaurant.categories.find((c) => c.name === oldName);
    if (existing) {
      await prisma.category.delete({ where: { id: existing.id } });
    }
  }

  await prisma.category.create({
    data: {
      restaurantId: restaurant.id,
      name: A_PARTAGER.name,
      sortOrder: A_PARTAGER.sortOrder,
      items: {
        create: A_PARTAGER.items.map((item, i) => ({
          name: item.name,
          description: item.description ?? null,
          price: item.price,
          sortOrder: i,
        })),
      },
    },
  });

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { menuVersion: { increment: 1 } },
  });

  console.log("Section A partager mise à jour");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
