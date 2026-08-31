// next.config.ts
// Allow WordPress media from the future admin.galaxisok.hu host and Jetpack CDN.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  async rewrites() {
    return [
      {
        source: "/galaxisok-koncertek.ics",
        destination: "/api/calendar",
      },
    ];
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 14,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.galaxisok.hu",
      },
      {
        protocol: "https",
        hostname: "galaxisok.hu",
      },
      {
        protocol: "https",
        hostname: "www.galaxisok.hu",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "0.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "1.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "2.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
