// src/components/logo-cursor.tsx
// Invert lens with a tiny black hotspot. Hovered icons appear inside the lens.

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { HeartMark } from "@/components/heart-mark";
import { SocialIcon } from "@/components/social-icon";
import { useCursorGlyph } from "@/lib/cursor-glyph";
import { isIframePage } from "@/lib/site";
import { cn } from "@/lib/utils";

function CursorGlyphMark({
  glyph,
}: {
  glyph: ReturnType<typeof useCursorGlyph>;
}) {
  if (!glyph) {
    return null;
  }

  if (glyph.kind === "heart") {
    return <HeartMark color={glyph.color} className="size-7" />;
  }

  return <SocialIcon kind={glyph.kind} className="size-5 text-white" />;
}

export function LogoCursor() {
  const pathname = usePathname();
  const glyph = useCursorGlyph();
  const native = isIframePage(pathname);
  const lensRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const posRef = useRef({ x: -80, y: -80 });

  useEffect(() => {
    document.documentElement.classList.toggle("native-cursor", native);
    return () => document.documentElement.classList.remove("native-cursor");
  }, [native]);

  useEffect(() => {
    const lens = lensRef.current;
    const art = artRef.current;
    const hint = hintRef.current;
    if (!lens || !art || native) {
      return;
    }

    const nodes = [lens, art];
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncMedia = () => {
      for (const node of nodes) {
        node.classList.toggle("is-fine", media.matches);
      }
      hint?.classList.toggle("is-fine", media.matches);
    };
    syncMedia();
    media.addEventListener("change", syncMedia);

    const draw = () => {
      frameRef.current = 0;
      const { x, y } = posRef.current;
      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      for (const node of nodes) {
        node.style.transform = transform;
        node.classList.add("is-on");
      }
      if (hint) {
        hint.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, 26px)`;
        hint.classList.add("is-on");
      }
    };

    const onMove = (event: PointerEvent) => {
      posRef.current.x = event.clientX;
      posRef.current.y = event.clientY;
      if (frameRef.current) {
        return;
      }
      frameRef.current = window.requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      media.removeEventListener("change", syncMedia);
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [native]);

  if (native) {
    return null;
  }

  const hasGlyph = glyph !== null;
  const isHeart = glyph?.kind === "heart";

  return (
    <>
      <div
        ref={lensRef}
        aria-hidden
        className={cn(
          "logo-cursor logo-cursor-lens",
          hasGlyph && "has-glyph",
          isHeart && "is-heart",
        )}
      />
      <div
        ref={artRef}
        aria-hidden
        className={cn(
          "logo-cursor logo-cursor-art",
          hasGlyph && "has-glyph",
          isHeart && "is-heart",
        )}
      >
        <img
          src="/cursor-players.png?v=2"
          alt=""
          width={30}
          height={30}
          draggable={false}
          className="logo-cursor-players"
        />
        <span className={cn("logo-cursor-glyph", hasGlyph && "is-on")}>
          <CursorGlyphMark glyph={glyph} />
        </span>
        <span className="logo-cursor-dot" />
      </div>
      <div
        ref={hintRef}
        aria-hidden
        className={cn("logo-cursor-hint", isHeart && "is-heart")}
      >
        Tedd le valahova
      </div>
    </>
  );
}
