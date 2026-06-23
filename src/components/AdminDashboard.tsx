"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number | null;
  priceSecondary: number | null;
  priceSecondaryLabel: string | null;
  available: boolean;
};

type Category = {
  id: string;
  name: string;
  groupLabel: string | null;
  items: MenuItem[];
};

type DailySpecial = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  available: boolean;
};

type AdminData = {
  menuVersion: number;
  categories: Category[];
  dailySpecials: DailySpecial[];
};

export function AdminDashboard({ restaurantName }: { restaurantName: string }) {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/menu", { credentials: "include" });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (res.ok) setData(await res.json());
  }, [router]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  async function api(action: string, payload: Record<string, unknown>) {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action, ...payload }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Enregistré — le menu public se met à jour automatiquement.");
      await load();
    } else {
      setMessage("Erreur lors de l'enregistrement.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.assign("/admin/login");
  }

  async function handleItemSubmit(e: FormEvent<HTMLFormElement>, item: MenuItem) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await api("updateItem", {
      id: item.id,
      categoryId: item.categoryId,
      name: fd.get("name"),
      description: fd.get("description") || null,
      price: fd.get("price") ? Number(fd.get("price")) : null,
      priceSecondary: fd.get("priceSecondary")
        ? Number(fd.get("priceSecondary"))
        : null,
      priceSecondaryLabel: fd.get("priceSecondaryLabel") || null,
      available: fd.get("available") === "on",
    });
  }

  async function handleNewItem(e: FormEvent<HTMLFormElement>, categoryId: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await api("createItem", {
      categoryId,
      name: fd.get("name"),
      description: fd.get("description") || null,
      price: fd.get("price") ? Number(fd.get("price")) : null,
      priceSecondary: fd.get("priceSecondary")
        ? Number(fd.get("priceSecondary"))
        : null,
    });
    form.reset();
  }

  async function handleNewCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const group = String(fd.get("groupLabel") ?? "").trim();
    await api("createCategory", {
      name: fd.get("name"),
      groupLabel: group || null,
    });
    form.reset();
  }

  async function handleCategorySubmit(
    e: FormEvent<HTMLFormElement>,
    category: Category
  ) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const group = String(fd.get("groupLabel") ?? "").trim();
    await api("updateCategory", {
      id: category.id,
      name: fd.get("name"),
      groupLabel: group || null,
    });
  }

  function deleteCategory(category: Category) {
    const msg =
      category.items.length > 0
        ? `Supprimer la catégorie « ${category.name} » et ses ${category.items.length} plat(s) ?`
        : `Supprimer la catégorie « ${category.name} » ?`;
    if (window.confirm(msg)) {
      api("deleteCategory", { id: category.id });
    }
  }

  const groupSuggestions = Array.from(
    new Set([
      "Vins & boissons",
      ...(data?.categories
        .map((c) => c.groupLabel)
        .filter((g): g is string => Boolean(g)) ?? []),
    ])
  );

  async function handleDailySubmit(
    e: FormEvent<HTMLFormElement>,
    special?: DailySpecial
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      description: fd.get("description") || null,
      price: fd.get("price") ? Number(fd.get("price")) : null,
      available: fd.get("available") === "on",
    };
    if (special) {
      await api("updateDailySpecial", { id: special.id, ...payload });
    } else {
      await api("createDailySpecial", payload);
      form.reset();
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-500">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="relative bg-[#2563eb] text-white px-4 py-4 sticky top-0 z-20 shadow-md sm:min-h-[72px]">
        <div className="text-center sm:px-32">
          <p className="text-xs uppercase tracking-widest text-blue-100">Espace client</p>
          <h1 className="font-serif text-xl">{restaurantName}</h1>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-0 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:justify-end">
          <a
            href="/menu/amico"
            target="_blank"
            className="text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25"
          >
            Voir le menu
          </a>
          <a
            href="/admin/qr"
            className="text-sm px-3 py-1.5 rounded-lg bg-white/25 hover:bg-white/35 font-medium"
          >
            QR Code
          </a>
          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 text-sm text-center py-2 border-b border-emerald-200">
          {message}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-stone-200">
          <h2 className="font-serif text-2xl text-[#8b3a2a] mb-4">Salades/ Pinsa</h2>
          <p className="text-sm text-stone-500 mb-4">
            Affichés en tête du menu client. Supprimez ou désactivez quand le service est terminé.
          </p>

          {data.dailySpecials.map((special) => (
            <form
              key={special.id}
              onSubmit={(e) => handleDailySubmit(e, special)}
              className="border border-stone-200 rounded-xl p-4 mb-3 space-y-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="name"
                  defaultValue={special.name}
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                  placeholder="Nom du plat"
                />
                <input
                  name="price"
                  type="number"
                  step="0.5"
                  defaultValue={special.price ?? ""}
                  className="border rounded-lg px-3 py-2 text-sm"
                  placeholder="Prix €"
                />
              </div>
              <input
                name="description"
                defaultValue={special.description ?? ""}
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Description"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="available"
                  type="checkbox"
                  defaultChecked={special.available}
                />
                Visible sur le menu
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#8b3a2a] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => api("deleteDailySpecial", { id: special.id })}
                  className="text-red-600 text-sm px-4 py-2 border border-red-200 rounded-lg"
                >
                  Supprimer
                </button>
              </div>
            </form>
          ))}

          <form
            onSubmit={(e) => handleDailySubmit(e)}
            className="border-2 border-dashed border-[#8b3a2a]/30 rounded-xl p-4 space-y-3"
          >
            <p className="text-sm font-medium text-[#8b3a2a]">+ Nouvelle salade / pinsa</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="name"
                required
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="Nom du plat"
              />
              <input
                name="price"
                type="number"
                step="0.5"
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="Prix €"
              />
            </div>
            <input
              name="description"
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Description"
            />
            <label className="flex items-center gap-2 text-sm">
              <input name="available" type="checkbox" defaultChecked />
              Visible sur le menu
            </label>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2c1810] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Ajouter
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 border-2 border-dashed border-[#2563eb]/40">
          <h2 className="font-serif text-2xl text-[#2563eb] mb-2">+ Nouvelle catégorie</h2>
          <p className="text-sm text-stone-500 mb-4">
            Créez une section pour organiser vos plats (ex. Entrées, Desserts, Cocktails…).
          </p>
          <form onSubmit={handleNewCategory} className="space-y-3">
            <input
              name="name"
              required
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Nom de la catégorie (ex. Salades)"
            />
            <div>
              <label className="text-xs text-stone-500 block mb-1">
                Groupe (optionnel — ex. « Vins & boissons »)
              </label>
              <input
                name="groupLabel"
                list="group-labels"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Laisser vide pour une section principale"
              />
              <datalist id="group-labels">
                {groupSuggestions
                  .filter(Boolean)
                  .map((g) => (
                    <option key={g} value={g} />
                  ))}
              </datalist>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2563eb] text-white text-sm px-4 py-2.5 rounded-lg disabled:opacity-50 w-full sm:w-auto"
            >
              Créer la catégorie
            </button>
          </form>
        </section>

        {data.categories.map((category) => (
          <section
            key={category.id}
            className="bg-white rounded-2xl shadow-sm p-6 border border-stone-200"
          >
            <form
              onSubmit={(e) => handleCategorySubmit(e, category)}
              className="border-b border-stone-200 pb-4 mb-4 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-stone-400">
                  Catégorie
                </p>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => deleteCategory(category)}
                  className="text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Supprimer la catégorie
                </button>
              </div>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="border rounded-lg px-3 py-2 text-sm w-full font-serif text-xl text-[#2c1810]"
              />
              <div>
                <label className="text-xs text-stone-500 block mb-1">Groupe</label>
                <input
                  name="groupLabel"
                  list="group-labels"
                  defaultValue={category.groupLabel ?? ""}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                  placeholder="Optionnel"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2563eb] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Enregistrer la catégorie
              </button>
            </form>

            {category.items.length === 0 && (
              <p className="text-sm text-stone-400 italic mb-4">
                Aucun plat — ajoutez-en ci-dessous.
              </p>
            )}

            {category.items.map((item) => (
              <form
                key={item.id}
                onSubmit={(e) => handleItemSubmit(e, item)}
                className="border border-stone-100 rounded-xl p-4 mb-3 space-y-3"
              >
                <div className="grid gap-3">
                  <input
                    name="name"
                    defaultValue={item.name}
                    required
                    className="border rounded-lg px-3 py-2 text-sm font-medium"
                  />
                  <input
                    name="description"
                    defaultValue={item.description ?? ""}
                    className="border rounded-lg px-3 py-2 text-sm"
                    placeholder="Description (optionnel)"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <input
                      name="price"
                      type="number"
                      step="0.5"
                      defaultValue={item.price ?? ""}
                      className="border rounded-lg px-3 py-2 text-sm"
                      placeholder="Prix verre / plat"
                    />
                    <input
                      name="priceSecondary"
                      type="number"
                      step="0.5"
                      defaultValue={item.priceSecondary ?? ""}
                      className="border rounded-lg px-3 py-2 text-sm"
                      placeholder="Prix bouteille"
                    />
                    <input
                      name="priceSecondaryLabel"
                      defaultValue={item.priceSecondaryLabel ?? "bouteille"}
                      className="border rounded-lg px-3 py-2 text-sm"
                      placeholder="Label 2e prix"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="available"
                    type="checkbox"
                    defaultChecked={item.available}
                  />
                  Visible sur le menu
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#8b3a2a] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => api("deleteItem", { id: item.id })}
                    className="text-red-600 text-sm px-3 py-2 border border-red-200 rounded-lg"
                  >
                    Supprimer
                  </button>
                </div>
              </form>
            ))}

            <form
              onSubmit={(e) => handleNewItem(e, category.id)}
              className="border-2 border-dashed border-stone-200 rounded-xl p-4 space-y-3 mt-4"
            >
              <p className="text-sm font-medium text-stone-600">+ Ajouter un plat</p>
              <input
                name="name"
                required
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Nom"
              />
              <input
                name="description"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Description"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="price"
                  type="number"
                  step="0.5"
                  className="border rounded-lg px-3 py-2 text-sm"
                  placeholder="Prix €"
                />
                <input
                  name="priceSecondary"
                  type="number"
                  step="0.5"
                  className="border rounded-lg px-3 py-2 text-sm"
                  placeholder="2e prix (vin)"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2c1810] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Ajouter
              </button>
            </form>
          </section>
        ))}
      </main>
    </div>
  );
}
