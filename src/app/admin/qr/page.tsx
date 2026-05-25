import { QrCodePanel } from "@/components/QrCodePanel";
import { getSession } from "@/lib/auth";
import { getPublicMenuUrl } from "@/lib/menu-url";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function QrPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const urlInfo = getPublicMenuUrl(session.slug, host);

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <header className="relative bg-[#2563eb] text-white px-4 py-4 shadow-md sm:min-h-[56px]">
        <h1 className="font-serif text-xl text-center sm:px-28">QR Code — {session.name}</h1>
        <Link
          href="/admin"
          className="mt-3 mx-auto block w-fit text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 sm:mt-0 sm:mx-0 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2"
        >
          ← Retour admin
        </Link>
      </header>
      <main className="py-10 px-4">
        <QrCodePanel menuUrl={urlInfo.url} urlInfo={urlInfo} />
      </main>
    </div>
  );
}
