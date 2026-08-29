// src/components/post-back-button.tsx
// Goes back in-site when possible, otherwise to the post's blog/category list.

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type PostBackButtonProps = {
  href: string;
};

export function PostBackButton({ href }: PostBackButtonProps) {
  const router = useRouter();

  function goBack() {
    const referrer = document.referrer;
    if (referrer) {
      try {
        if (new URL(referrer).origin === window.location.origin) {
          router.back();
          return;
        }
      } catch {
        router.push(href);
        return;
      }
    }

    router.push(href);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="post-back inline-flex h-8 shrink-0 items-center gap-2 border border-white/25 px-3 font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] text-white/80 uppercase"
    >
      <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
      Vissza
    </button>
  );
}
