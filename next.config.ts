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
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '.github.dev',
    '.app.github.dev'
  ],
};

export default nextConfig;
