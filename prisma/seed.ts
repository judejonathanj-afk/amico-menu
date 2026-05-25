import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type ItemSeed = {
  name: string;
  description?: string;
  price?: number;
  priceSecondary?: number;
  priceSecondaryLabel?: string;
};

type CategorySeed = {
  name: string;
  groupLabel?: string;
  sortOrder: number;
  items: ItemSeed[];
};

const MENU: CategorySeed[] = [
  {
    name: "Entrées",
    sortOrder: 1,
    items: [
      {
        name: "Amatriciana",
        description: "guanciale, tomates, pecorino romano",
        price: 17,
      },
      {
        name: "Carbonara",
        description: "paccheri, œufs, guanciale, parmesan",
        price: 17,
      },
      {
        name: "Cacio e pepe",
        description: "paccheri, pecorino romano, poivre noir",
        price: 16,
      },
    ],
  },
  {
    name: "Spécialités",
    sortOrder: 2,
    items: [
      {
        name: "Raviolis ricotta & épinards à la crème de truffe",
        price: 22,
      },
      { name: "Cavatappi aux figues & foie gras maison", price: 22 },
      { name: "Linguinis Boscaiola", price: 19 },
      { name: "Linguinis (calamar, Saint Jacques)", price: 22 },
      { name: "Poulpe à la Luciana", price: 28 },
    ],
  },
  {
    name: "Viandes",
    sortOrder: 3,
    items: [
      { name: "Pièce de bœuf tranchée", price: 25 },
      { name: "Tartare de bœuf à l'italienne", price: 19 },
    ],
  },
  {
    name: "Desserts",
    sortOrder: 4,
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
  },
  {
    name: "Vin rouge",
    groupLabel: "Vins & boissons",
    sortOrder: 10,
    items: [
      { name: "Nero d'Avola", price: 8, priceSecondary: 35, priceSecondaryLabel: "bouteille" },
      { name: "Montepulciano", price: 9, priceSecondary: 38 },
      { name: "Primitivo", price: 9, priceSecondary: 38 },
      { name: "Rosso Montalcino", price: 52, priceSecondaryLabel: "bouteille" },
      { name: "Valpolicella Ripasso", price: 50 },
      { name: "Barbera", price: 55 },
    ],
  },
  {
    name: "Vin blanc",
    groupLabel: "Vins & boissons",
    sortOrder: 11,
    items: [
      { name: "Chardonnay", price: 9, priceSecondary: 40 },
      { name: "Pinot grigio", price: 8, priceSecondary: 35 },
      { name: "Gewurztraminer", price: 10, priceSecondary: 42 },
      { name: "Vermentino", price: 40 },
    ],
  },
  {
    name: "Vin rosé",
    groupLabel: "Vins & boissons",
    sortOrder: 12,
    items: [{ name: "Ruffino Rosatello", price: 8, priceSecondary: 35 }],
  },
  {
    name: "Prosecco",
    groupLabel: "Vins & boissons",
    sortOrder: 13,
    items: [
      { name: "Prosecco Brut", price: 10, priceSecondary: 42 },
      { name: "Prosecco Rosé", price: 10, priceSecondary: 35 },
    ],
  },
  {
    name: "Cocktails",
    groupLabel: "Vins & boissons",
    sortOrder: 14,
    items: [
      { name: "Spritz", price: 11 },
      { name: "Spritz limoncello", price: 12 },
      { name: "Spritz St Germain", price: 12 },
      { name: "Negroni", price: 14 },
      { name: "Caipirinha", price: 12 },
      { name: "Moscow mule", price: 12 },
      { name: "Piña colada", price: 12 },
    ],
  },
  {
    name: "Alcools",
    groupLabel: "Vins & boissons",
    sortOrder: 15,
    items: [
      { name: "Whisky JB", price: 12 },
      { name: "Whisky Black Label", price: 14 },
      { name: "Vodka", price: 12 },
      { name: "Vodka Grey Goose", price: 14 },
      { name: "Gin tonic", price: 12 },
      { name: "Rhum", price: 10 },
    ],
  },
  {
    name: "Digestifs",
    groupLabel: "Vins & boissons",
    sortOrder: 16,
    items: [
      { name: "Amaretto", price: 9 },
      { name: "Limoncello", price: 9 },
      { name: "Get 27", price: 10 },
      { name: "Grappa", price: 10 },
      { name: "Cognac", price: 16 },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("Amico2026!", 12);

  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.dailySpecial.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      slug: "amico",
      name: "Amico",
      passwordHash,
      menuVersion: 1,
      categories: {
        create: MENU.map((cat) => ({
          name: cat.name,
          groupLabel: cat.groupLabel ?? null,
          sortOrder: cat.sortOrder,
          items: {
            create: cat.items.map((item, i) => ({
              name: item.name,
              description: item.description ?? null,
              price: item.price ?? null,
              priceSecondary: item.priceSecondary ?? null,
              priceSecondaryLabel: item.priceSecondary
                ? (item.priceSecondaryLabel ?? "bouteille")
                : null,
              sortOrder: i,
            })),
          },
        })),
      },
    },
  });

  console.log("Restaurant créé:", restaurant.name);
  console.log("Slug public: /menu/amico");
  console.log("Admin: /admin/login");
  console.log("Identifiant: amico");
  console.log("Mot de passe: Amico2026!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
