// src/lib/hero-nav.ts
// Last path survives layout remounts so home → Rólunk can keep the same photo.

const STORAGE_KEY = "gx-hero-path";

let lastPathname = "";

export function readHeroPath(): string {
  if (lastPathname) {
    return lastPathname;
  }

  if (typeof sessionStorage === "undefined") {
    return "";
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeHeroPath(pathname: string): void {
  lastPathname = pathname;

  if (typeof sessionStorage === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, pathname);
  } catch {
    /* private mode */
  }
}

export function isHomeAboutPair(previous: string, pathname: string): boolean {
  return (
    (previous === "/" && pathname === "/rolunk") ||
    (previous === "/rolunk" && pathname === "/")
  );
}
