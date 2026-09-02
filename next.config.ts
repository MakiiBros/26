import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
