// src/components/blog-list-fade.tsx
// Fades the post list when the category or page changes.

"use client";

import type { ReactNode } from "react";

import { useFadeOnChange } from "@/lib/use-fade-on-change";

type BlogListFadeProps = {
  listKey: string;
  children: ReactNode;
};

export function BlogListFade({ listKey, children }: BlogListFadeProps) {
  const visible = useFadeOnChange(listKey);

  return (
    <div className={visible ? "blog-list-fade is-in" : "blog-list-fade is-out"}>
      {children}
    </div>
  );
}
