// src/components/home-spotlight.tsx
// Optional homepage headline + play control, from the WordPress `fohir` page.

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
    <div className="home-spotlight">
      <p className="home-spotlight-title">{news.title}</p>
      <a
        href={news.href}
        className="home-play"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        aria-label={`${news.title} — megnyitás`}
      >
        <Play className="size-7 translate-x-0.5" fill="currentColor" aria-hidden />
      </a>
    </div>
  );
}
