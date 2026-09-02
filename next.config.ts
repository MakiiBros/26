import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos los hostnames temporalmente o ajusta a tu Supabase URL
      },
    ],
  },
};

export default nextConfig;
