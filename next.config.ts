import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Images optimization
   * Support moderne formats (AVIF, WebP) + responsive
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /**
   * SEO & Performance
   */
  trailingSlash: false,
  compress: true,

  /**
   * Headers personnalisés pour performance
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-UA-Compatible",
            value: "IE=edge",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Cache des images statiques
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache des fonts
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /**
   * Redirections
   */
  async redirects() {
    return [
      // Vers le dashboard admin (sans trailing slash)
      {
        source: "/admin/",
        destination: "/admin",
        permanent: true,
      },
    ];
  },

  /**
   * Optimisations du build
   */
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "firebase", "framer-motion"],
  },

  /**
   * Turbopack (bundler par défaut depuis Next.js 15+).
   * Configuration vide = comportement par défaut, mais nécessaire pour
   * éviter le conflit avec une config webpack personnalisée.
   */
  turbopack: {},
};

export default nextConfig;
