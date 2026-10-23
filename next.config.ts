import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Prisma engine files must not be bundled — keeps Vercel serverless builds stable */
  serverExternalPackages: ["@prisma/client", "prisma"],
  /* Admin-added products can use any https image URL (Cloudinary, ImgBB, etc.) */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
