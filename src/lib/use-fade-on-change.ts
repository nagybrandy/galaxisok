// src/lib/use-fade-on-change.ts
// Hide before paint, then fade in.

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function useFadeOnChange(key: string, skip = false) {
  const keyRef = useRef(key);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (key === keyRef.current) {
      return;
    }

    keyRef.current = key;

    if (
      skip ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    setVisible(false);
  }, [key, skip]);

  useEffect(() => {
    if (visible) {
      return;
    }

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [visible]);

  return visible;
}
