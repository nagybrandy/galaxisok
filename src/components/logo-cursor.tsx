// src/components/logo-cursor.tsx
// One inverted circle. The footballers sit inside and invert with the page.

"use client";

import { useEffect, useRef } from "react";

export function LogoCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const posRef = useRef({ x: -80, y: -80 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncMedia = () => {
      cursor.classList.toggle("is-fine", media.matches);
    };
    syncMedia();
    media.addEventListener("change", syncMedia);

    const draw = () => {
      frameRef.current = 0;
      const { x, y } = posRef.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      cursor.classList.add("is-on");
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

  return (
    <div ref={cursorRef} aria-hidden className="logo-cursor">
      <img
        src="/cursor-players.png?v=3"
        alt=""
        width={44}
        height={44}
        draggable={false}
        className="logo-cursor-players"
      />
    </div>
  );
}
