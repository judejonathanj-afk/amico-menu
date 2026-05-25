"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { MenuUrlInfo } from "@/lib/menu-url";

type Props = {
  menuUrl: string;
  urlInfo: MenuUrlInfo;
};

export function QrCodePanel({ menuUrl: initialUrl, urlInfo }: Props) {
  const [menuUrl, setMenuUrl] = useState(initialUrl);
  const [customUrl, setCustomUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    setMenuUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    QRCode.toDataURL(menuUrl, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#2c1810", light: "#faf6f0" },
    }).then(setDataUrl);
  }, [menuUrl]);

  function applyCustomUrl() {
    const trimmed = customUrl.trim().replace(/\/$/, "");
    if (trimmed) setMenuUrl(trimmed);
  }

  return (
    <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
      {urlInfo.warning && (
        <div
          className={`w-full rounded-xl px-4 py-3 text-sm ${
            urlInfo.isProduction
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-amber-50 text-amber-900 border border-amber-200"
          }`}
        >
          {urlInfo.isProduction ? (
            <p>✓ URL publique — le QR code fonctionne sur tous les téléphones.</p>
          ) : (
            <>
              <p className="font-medium mb-1">Important</p>
              <p>{urlInfo.warning}</p>
              {urlInfo.isLocalNetwork && (
                <p className="mt-2 text-xs opacity-90">
                  Assurez-vous que le serveur tourne avec{" "}
                  <code className="bg-amber-100 px-1 rounded">npm run dev</code> et que
                  le téléphone est sur le même Wi‑Fi.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="QR Code menu Amico"
          className="rounded-2xl shadow-lg border-4 border-white w-[min(100%,360px)] h-auto"
        />
      ) : (
        <div className="w-80 h-80 bg-stone-200 animate-pulse rounded-2xl" />
      )}

      <p className="text-sm text-stone-700 text-center break-all font-mono bg-white/80 rounded-lg px-3 py-2 w-full border border-stone-200">
        {menuUrl}
      </p>

      <div className="w-full space-y-2">
        <label className="text-xs text-stone-500 block">
          URL personnalisée (après déploiement sur Internet)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://votre-site.com/menu/amico"
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={applyCustomUrl}
            className="shrink-0 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Appliquer
          </button>
        </div>
      </div>

      <a
        href={dataUrl}
        download="amico-menu-qr.png"
        className="bg-[#2563eb] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-600 w-full text-center"
      >
        Télécharger le QR code (PNG)
      </a>

      <p className="text-xs text-stone-500 text-center">
        Imprimez ce QR code et placez-le sur chaque table. Les clients scannent avec
        l&apos;appareil photo de leur téléphone et voient le menu mis à jour en temps réel.
      </p>
    </div>
  );
}
