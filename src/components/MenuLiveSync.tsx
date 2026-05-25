"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
  slug: string;
  menuVersion: number;
};

/** Polls menu version and refreshes server-rendered page when admin updates the menu. */
export function MenuLiveSync({ slug, menuVersion }: Props) {
  const router = useRouter();
  const versionRef = useRef(menuVersion);

  useEffect(() => {
    versionRef.current = menuVersion;
  }, [menuVersion]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/api/menu/${slug}`, {
          headers: { "x-menu-version": String(versionRef.current) },
          cache: "no-store",
        });
        if (res.status === 304) return;
        if (!res.ok) return;

        const data = (await res.json()) as { menuVersion: number };
        if (data.menuVersion !== versionRef.current) {
          versionRef.current = data.menuVersion;
          router.refresh();
        }
      } catch {
        // ignore network errors — menu stays on last server render
      }
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [slug, router]);

  return null;
}
