// src/components/home-scroll-lock.tsx
// Locks the document on the landing photo so the hero cannot be pulled off-screen.

"use client";

import { useEffect } from "react";

export function HomeScrollLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-lock");

    return () => {
      root.classList.remove("home-lock");
    };
  }, []);

  return null;
}
