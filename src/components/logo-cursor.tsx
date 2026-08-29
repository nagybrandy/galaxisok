// src/components/logo-cursor.tsx
// One inverted circle. The footballers sit inside and invert with the page.

"use client";

import { useEffect, useRef } from "react";

import { HeartMark } from "@/components/heart-mark";
import { useCursorGlyph } from "@/lib/cursor-glyph";
import { cn } from "@/lib/utils";

export function LogoCursor() {
  const glyph = useCursorGlyph();
  const cursorRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const posRef = useRef({ x: -80, y: -80 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const hint = hintRef.current;
    if (!cursor) {
      return;
    }

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncMedia = () => {
      cursor.classList.toggle("is-fine", media.matches);
      hint?.classList.toggle("is-fine", media.matches);
    };
    syncMedia();
    media.addEventListener("change", syncMedia);

    const draw = () => {
      frameRef.current = 0;
      const { x, y } = posRef.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      cursor.classList.add("is-on");
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
    window.addEventListener("pointerdown", onMove, { passive: true });

    return () => {
      media.removeEventListener("change", syncMedia);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const isHeart = glyph?.kind === "heart";

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden
        className={cn("logo-cursor", isHeart && "is-heart")}
      >
        <img
          src="/cursor-players.png?v=3"
          alt=""
          width={44}
          height={44}
          draggable={false}
          className="logo-cursor-players"
        />
        <span className={cn("logo-cursor-glyph", isHeart && "is-on")}>
          {glyph?.kind === "heart" ? (
            <HeartMark color={glyph.color} className="size-7" />
          ) : null}
        </span>
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
