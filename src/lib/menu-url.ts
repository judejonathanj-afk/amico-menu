import { networkInterfaces } from "os";

export type MenuUrlInfo = {
  url: string;
  isLocalNetwork: boolean;
  isProduction: boolean;
  warning?: string;
};

function getLanIp(): string | null {
  const nets = networkInterfaces();
  for (const iface of Object.values(nets)) {
    if (!iface) continue;
    for (const net of iface) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

export function getPublicMenuUrl(slug: string, requestHost?: string): MenuUrlInfo {
  const baseFromEnv = process.env.NEXT_PUBLIC_MENU_URL?.replace(/\/$/, "");
  if (baseFromEnv) {
    return {
      url: `${baseFromEnv}/menu/${slug}`,
      isLocalNetwork: false,
      isProduction: !baseFromEnv.includes("localhost"),
    };
  }

  const host = requestHost ?? "localhost:3000";
  const port = host.includes(":") ? host.split(":").pop() : "3000";
  const hostname = host.split(":")[0];

  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("127.");

  if (isLocal) {
    const lanIp = getLanIp();
    if (lanIp) {
      return {
        url: `http://${lanIp}:${port}/menu/${slug}`,
        isLocalNetwork: true,
        isProduction: false,
        warning:
          "Mode test Wi‑Fi : les clients doivent être sur le même réseau que ce serveur. Pour la production, définissez NEXT_PUBLIC_MENU_URL dans .env.",
      };
    }
    return {
      url: `http://localhost:${port}/menu/${slug}`,
      isLocalNetwork: true,
      isProduction: false,
      warning:
        "localhost ne fonctionne pas sur les téléphones des clients. Déployez l'application ou configurez NEXT_PUBLIC_MENU_URL.",
    };
  }

  const isPrivateIp =
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);

  const protocol = isPrivateIp ? "http" : "https";

  return {
    url: `${protocol}://${host}/menu/${slug}`,
    isLocalNetwork: isPrivateIp,
    isProduction: !isPrivateIp,
    warning: isPrivateIp
      ? "Adresse réseau local : fonctionne uniquement sur le Wi‑Fi du restaurant."
      : undefined,
  };
}
