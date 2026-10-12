// src/app/sitemap.ts
// Static pages plus every published WordPress post.

import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 3600;

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/koncertek", changeFrequency: "weekly", priority: 0.8 },
  { path: "/rolunk", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hirlevel", changeFrequency: "monthly", priority: 0.5 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.5 },
  { path: "/aszf", changeFrequency: "yearly", priority: 0.2 },
  { path: "/adatkezeles", changeFrequency: "yearly", priority: 0.2 },
  { path: "/sutik", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const posts = await getPosts();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
