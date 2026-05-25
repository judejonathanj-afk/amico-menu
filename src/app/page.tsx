import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf6f0] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.35em] text-[#8b3a2a]">
        Menu digital
      </p>
      <h1 className="font-serif text-5xl text-[#2c1810] mt-2">Amico</h1>
      <p className="text-stone-600 mt-4 max-w-md">
        Menu accessible par QR code sur table. Espace sécurisé pour modifier la carte en temps
        réel.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link
          href="/menu/amico"
          className="bg-[#8b3a2a] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#a04532] transition-colors"
        >
          Voir le menu client
        </Link>
        <Link
          href="/admin/login"
          className="border border-[#8b3a2a] text-[#8b3a2a] px-8 py-3 rounded-xl font-medium hover:bg-[#8b3a2a]/5 transition-colors"
        >
          Espace restaurant
        </Link>
      </div>
    </div>
  );
}
