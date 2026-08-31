// src/components/page-fade.tsx
// Incoming page starts hidden, then fades in.

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useFadeOnChange } from "@/lib/use-fade-on-change";

type PageFadeProps = {
  children: ReactNode;
};

export function PageFade({ children }: PageFadeProps) {
  const pathname = usePathname();
  const visible = useFadeOnChange(pathname);

  return (
    <div className={visible ? "page-fade is-in" : "page-fade is-out"}>
      {children}
    </div>
  );
}
