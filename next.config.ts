import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not enable 'standalone' on Vercel because Vercel manages serverless output natively
  ...(process.env.OUTPUT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos los hostnames o ajusta a tu Supabase URL
      },
    ],
  },
};

export default nextConfig;
