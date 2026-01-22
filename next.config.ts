import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // STABLE: serverExternalPackages is now a top-level property
  serverExternalPackages: ["@sanity/client"],

  // STABLE: reactCompiler is now a top-level property in Next.js 15+
  reactCompiler: true,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
