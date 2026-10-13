// src/app/robots.ts
// Crawl rules for the public site; the proxy adds noindex on non-.hu hosts.

import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/kapu", "/webshop", "/zene"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
