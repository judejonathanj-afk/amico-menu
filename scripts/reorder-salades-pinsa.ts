import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ORDER = [
  "grande caprese",
  "grande del mare",
  "grande del mar",
  "grande cesar",
  "grande peperoni",
  "pinsa creme de truffe et mortadelle",
  "pinsa parma",
  "pinsa végi",
];

function normalize(name: string) {
  return name.trim().toLowerCase();
}

async function main() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "amico" },
    include: { dailySpecials: { orderBy: { sortOrder: "asc" } } },
  });

  if (!restaurant) {
    throw new Error("Restaurant amico introuvable");
  }

  const byName = new Map(
    restaurant.dailySpecials.map((s) => [normalize(s.name), s])
  );

  const ordered = ORDER.map((name) => byName.get(normalize(name))).filter(
    Boolean
  );

  const remaining = restaurant.dailySpecials.filter(
    (s) => !ordered.some((o) => o!.id === s.id)
  );

  const finalList = [...ordered, ...remaining];

  for (let i = 0; i < finalList.length; i++) {
    const item = finalList[i]!;
    await prisma.dailySpecial.update({
      where: { id: item.id },
      data: { sortOrder: i + 1 },
    });
    console.log(`${i + 1}. ${item.name}`);
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { menuVersion: { increment: 1 } },
  });

  console.log("\nOrdre mis à jour.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
