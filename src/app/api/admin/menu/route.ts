import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bumpMenuVersion } from "@/lib/menu";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.restaurantId },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: { items: { orderBy: { sortOrder: "asc" } } },
      },
      dailySpecials: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    menuVersion: restaurant.menuVersion,
    categories: restaurant.categories,
    dailySpecials: restaurant.dailySpecials,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action as string;

  switch (action) {
    case "createItem": {
      const item = await prisma.menuItem.create({
        data: {
          categoryId: body.categoryId,
          name: body.name,
          description: body.description || null,
          price: body.price ?? null,
          priceSecondary: body.priceSecondary ?? null,
          priceSecondaryLabel: body.priceSecondaryLabel ?? "bouteille",
          sortOrder: body.sortOrder ?? 999,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(item);
    }
    case "updateItem": {
      const item = await prisma.menuItem.update({
        where: { id: body.id },
        data: {
          name: body.name,
          description: body.description ?? null,
          price: body.price ?? null,
          priceSecondary: body.priceSecondary ?? null,
          priceSecondaryLabel: body.priceSecondaryLabel ?? null,
          available: body.available,
          categoryId: body.categoryId,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(item);
    }
    case "deleteItem": {
      await prisma.menuItem.delete({ where: { id: body.id } });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json({ ok: true });
    }
    case "createCategory": {
      const max = await prisma.category.aggregate({
        where: { restaurantId: session.restaurantId },
        _max: { sortOrder: true },
      });
      const category = await prisma.category.create({
        data: {
          restaurantId: session.restaurantId,
          name: String(body.name ?? "").trim(),
          groupLabel: body.groupLabel
            ? String(body.groupLabel).trim()
            : null,
          sortOrder: (max._max.sortOrder ?? 0) + 1,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(category);
    }
    case "updateCategory": {
      const category = await prisma.category.update({
        where: { id: body.id },
        data: {
          name: String(body.name ?? "").trim(),
          groupLabel: body.groupLabel
            ? String(body.groupLabel).trim()
            : null,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(category);
    }
    case "deleteCategory": {
      await prisma.category.delete({ where: { id: body.id } });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json({ ok: true });
    }
    case "createDailySpecial": {
      const max = await prisma.dailySpecial.aggregate({
        where: { restaurantId: session.restaurantId },
        _max: { sortOrder: true },
      });
      const special = await prisma.dailySpecial.create({
        data: {
          restaurantId: session.restaurantId,
          name: body.name,
          description: body.description ?? null,
          price: body.price ?? null,
          sortOrder: (max._max.sortOrder ?? 0) + 1,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(special);
    }
    case "updateDailySpecial": {
      const special = await prisma.dailySpecial.update({
        where: { id: body.id },
        data: {
          name: body.name,
          description: body.description ?? null,
          price: body.price ?? null,
          available: body.available,
        },
      });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json(special);
    }
    case "deleteDailySpecial": {
      await prisma.dailySpecial.delete({ where: { id: body.id } });
      await bumpMenuVersion(session.restaurantId);
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  }
}
