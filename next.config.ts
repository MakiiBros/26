import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.OUTPUT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb',
    },
  },
};

export default nextConfig;
