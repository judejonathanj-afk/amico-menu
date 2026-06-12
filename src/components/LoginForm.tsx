"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        slug: fd.get("slug"),
        password: fd.get("password"),
      }),
    });

    if (res.ok) {
      // Full page load so Safari persists the session cookie before /admin
      window.location.assign("/admin");
      return;
    }

    setLoading(false);
    const data = await res.json();
    setError(data.error ?? "Erreur de connexion");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block text-sm text-stone-600 mb-1">Identifiant</label>
        <input
          name="slug"
          defaultValue="amico"
          required
          autoComplete="username"
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a2a]/40"
          placeholder="amico"
        />
      </div>
      <div>
        <label className="block text-sm text-stone-600 mb-1">Mot de passe</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a2a]/40"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#8b3a2a] hover:bg-[#a04532] text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-colors touch-manipulation min-h-[48px]"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
