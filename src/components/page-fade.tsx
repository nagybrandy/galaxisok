// src/components/page-fade.tsx
// Incoming page starts hidden, then fades in. Home ↔ Rólunk keeps the shared photo.

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { isHomeAboutPair, readHeroPath } from "@/lib/hero-nav";
import { useFadeOnChange } from "@/lib/use-fade-on-change";

type PageFadeProps = {
  children: ReactNode;
};

export function PageFade({ children }: PageFadeProps) {
  const pathname = usePathname();
  const previous = readHeroPath() || pathname;
  const skipHero = isHomeAboutPair(previous, pathname);
  const visible = useFadeOnChange(pathname, skipHero);

  return (
    <div className={visible ? "page-fade is-in" : "page-fade is-out"}>
      {children}
    </div>
  );
}
