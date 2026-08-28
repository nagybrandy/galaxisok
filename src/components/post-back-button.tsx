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
      className="crumb-link inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-white/55 uppercase"
    >
      <ArrowLeft className="size-3.5" strokeWidth={1.6} aria-hidden />
      Vissza
    </button>
  );
}
