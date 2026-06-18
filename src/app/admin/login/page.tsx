import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#faf6f0] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e8ddd0] p-8">
        <Link href="/" className="text-xs text-stone-400 hover:text-stone-600">
          ← Accueil
        </Link>
        <h1 className="font-serif text-3xl text-[#2c1810] mt-4">Espace Amico</h1>
        <p className="text-sm text-stone-500 mt-2 mb-4">
          Connectez-vous pour modifier votre menu et vos plats du jour.
        </p>
        <div className="mb-6 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-left text-xs text-stone-600 space-y-1">
          <p>
            <strong>Identifiant :</strong> amico
          </p>
          <p>
            <strong>Mot de passe :</strong> celui communiqué par le
            restaurateur (sensible à la casse).
          </p>
          <p className="text-stone-500">
            Compatible Chrome, Safari, Firefox et Edge. Si la page revient ici
            après connexion, videz le cache ou essayez une fenêtre privée.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
