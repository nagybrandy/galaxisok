// src/components/page-fade.tsx
// Incoming page starts hidden, then fades in. Home → Rólunk keeps the photo.

"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { useFadeOnChange } from "@/lib/use-fade-on-change";

type PageFadeProps = {
  children: ReactNode;
};

export function PageFade({ children }: PageFadeProps) {
  const pathname = usePathname();
  const prevRef = useRef(pathname);
  const fromHomeToAbout = prevRef.current === "/" && pathname === "/rolunk";
  const visible = useFadeOnChange(pathname, fromHomeToAbout);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (fromHomeToAbout && !reduced) {
      html.classList.add("from-home-about");
      html.classList.remove("from-home-about-settle");
      let inner = 0;
      const outer = window.requestAnimationFrame(() => {
        inner = window.requestAnimationFrame(() => {
          html.classList.add("from-home-about-settle");
        });
      });
      prevRef.current = pathname;
      return () => {
        window.cancelAnimationFrame(outer);
        window.cancelAnimationFrame(inner);
      };
    }

    html.classList.remove("from-home-about", "from-home-about-settle");
    prevRef.current = pathname;
  }, [pathname, fromHomeToAbout]);

  return (
    <div className={visible ? "page-fade is-in" : "page-fade is-out"}>
      {children}
    </div>
  );
}
