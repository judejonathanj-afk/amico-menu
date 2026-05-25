import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l’accès depuis le téléphone sur le réseau local (dev)
  allowedDevOrigins: ["192.168.1.25", "192.168.1.25:3000", "192.168.1.25:3002", "192.168.1.25:3003"],
};

export default nextConfig;
