"use server";

import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!slug || !password) {
    return { error: "Identifiant et mot de passe requis." };
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return { error: "Identifiants incorrects. Vérifiez l'identifiant (ex. amico)." };
  }

  const valid = await verifyPassword(password, restaurant.passwordHash);
  if (!valid) {
    return { error: "Mot de passe incorrect." };
  }

  await createSession({
    restaurantId: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,
  });

  redirect("/admin");
}
