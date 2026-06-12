import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  attachSessionCookie,
  buildSessionToken,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const slug = String(body.slug ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!slug || !password) {
    return NextResponse.json(
      { error: "Identifiant et mot de passe requis." },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, restaurant.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const token = await buildSessionToken({
    restaurantId: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,
  });

  const response = NextResponse.json({ ok: true, name: restaurant.name });
  attachSessionCookie(response, token);
  return response;
}
