// src/components/mobile-menu.tsx
// Full-screen mobile nav. The same mark morphs into an X when the overlay opens.

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { HERO_IMAGE, NAV_LINKS, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

import { SocialLinks } from "./social-links";

type MobileMenuProps = {
  links?: NavLink[];
};

export function MobileMenu({ links = NAV_LINKS }: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="relative z-10 flex size-10 items-center justify-end text-white"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü bezárása" : "Menü"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={cn("menu-mark", open && "is-open")} aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="mobile-menu fixed inset-0 z-0 flex flex-col text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
        >
          <div className="absolute inset-0 overflow-hidden bg-[#050b1c]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-cover object-[center_16%] scale-[1.12] blur-[14px]"
            />
            <div className="mobile-menu-noise" aria-hidden />
            <div className="mobile-menu-noise-fine" aria-hidden />
            <div className="absolute inset-0 bg-[rgba(12,36,110,0.52)]" />
          </div>

          <nav className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center gap-5 overflow-y-auto px-5 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.25rem))] pb-6">
            {links.map((link) => {
              const active =
                !link.external &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

              const itemClass = cn(
                "mobile-menu-link font-[family-name:var(--font-display)] text-[2.35rem] font-semibold leading-none tracking-[0.18em] uppercase",
                active ? "text-white" : "text-white/78",
              );

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={itemClass}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link key={link.href} href={link.href} prefetch className={itemClass}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-[1] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2">
            <SocialLinks layout="menu" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
