// src/components/persistent-hero.tsx
// Same home photo stays mounted. On Rólunk it shrinks in place, then the copy fades in.

"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import { GrainOverlay } from "@/components/grain-overlay";
import {
  isHomeAboutPair,
  readHeroPath,
  writeHeroPath,
} from "@/lib/hero-nav";
import { HERO_IMAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

type HeroPhase = "home" | "about" | "hidden";

function phaseFor(pathname: string): HeroPhase {
  switch (pathname) {
    case "/":
      return "home";
    case "/rolunk":
      return "about";
    default:
      return "hidden";
  }
}

function comingFromHome(pathname: string): boolean {
  return readHeroPath() === "/" && pathname === "/rolunk";
}

function clearHeroNavClasses() {
  document.documentElement.classList.remove("hero-from-home", "hero-copy-in");
}

export function PersistentHero() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<HeroPhase>(() =>
    comingFromHome(pathname) ? "home" : phaseFor(pathname),
  );
  const [animated, setAnimated] = useState(() => comingFromHome(pathname));

  useLayoutEffect(() => {
    const previous = readHeroPath();
    writeHeroPath(pathname);
    const next = phaseFor(pathname);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pathname === "/kapu") {
      setAnimated(false);
      setPhase("hidden");
      clearHeroNavClasses();
      return;
    }

    const fromHomeToAbout = previous === "/" && pathname === "/rolunk";
    const betweenHeroPages = isHomeAboutPair(previous, pathname);

    if (fromHomeToAbout && !reduced) {
      const root = document.documentElement;
      root.classList.add("hero-from-home");
      root.classList.remove("hero-copy-in");
      window.scrollTo(0, 0);
      setAnimated(true);
      setPhase("home");
      let inner = 0;
      const outer = window.requestAnimationFrame(() => {
        inner = window.requestAnimationFrame(() => {
          setPhase("about");
          root.classList.add("hero-copy-in");
        });
      });
      return () => {
        window.cancelAnimationFrame(outer);
        window.cancelAnimationFrame(inner);
      };
    }

    clearHeroNavClasses();
    setAnimated(!reduced && betweenHeroPages && previous !== pathname);
    setPhase(next);
  }, [pathname]);

  if (pathname === "/kapu") {
    return null;
  }

  return (
    <div
      aria-hidden
      className={cn(
        "persistent-hero",
        `is-${phase}`,
        animated && "is-animated",
      )}
      onTransitionEnd={(event) => {
        if (event.propertyName !== "height") {
          return;
        }
        clearHeroNavClasses();
        setAnimated(false);
      }}
    >
      <div className="persistent-hero-frame">
        <img
          src={HERO_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="persistent-hero-img"
        />
        <GrainOverlay />
      </div>
    </div>
  );
}
