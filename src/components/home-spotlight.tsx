// src/components/home-spotlight.tsx
// Homepage headline + play control over the photo, Fruit Bats style.

"use client";

import { Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { FeaturedNews } from "@/lib/wordpress";

export function HomeSpotlight() {
  const pathname = usePathname();
  const [news, setNews] = useState<FeaturedNews>(null);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let cancelled = false;

    void fetch("/api/fohir")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: FeaturedNews) => {
        if (!cancelled && payload?.title && payload?.href) {
          setNews(payload);
        }
      })
      .catch(() => {
        /* teaser is optional */
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname !== "/" || !news) {
    return null;
  }

  const external = /^https?:\/\//i.test(news.href);

  return (
    <div className="home-spotlight is-appearing">
      <p className="home-spotlight-title">{news.title}</p>
      <a
        href={news.href}
        className="home-play"
        aria-label={news.linkLabel || "Lejátszás"}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        <Play fill="currentColor" strokeWidth={0} aria-hidden />
      </a>
    </div>
  );
}
