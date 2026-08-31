// src/components/mobile-menu.tsx
// Full-screen nav from phone through tablet. Wordmark stays on the overlay.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { HERO_IMAGE, NAV_LINKS, shouldPrefetchRoute, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { SkeletonImage } from "./skeleton-image";
import { SocialLinks } from "./social-links";

type MobileMenuProps = {
  links?: NavLink[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileMenu({
  links = NAV_LINKS,
  open,
  onOpenChange,
}: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        onOpenChange(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="relative z-20 flex size-10 items-center justify-end text-white"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü bezárása" : "Menü"}
        onClick={() => onOpenChange(!open)}
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
          className="mobile-menu fixed inset-0 z-[1] flex flex-col text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
        >
          <div className="absolute inset-0 overflow-hidden bg-[#050b1c]">
            <SkeletonImage
              src={HERO_IMAGE}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_16%] scale-[1.12] blur-[14px]"
            />
            <div className="mobile-menu-noise" aria-hidden />
            <div className="mobile-menu-noise-fine" aria-hidden />
            <div className="absolute inset-0 bg-[rgba(12,36,110,0.52)]" />
          </div>

          <div className="relative z-[2] flex items-center px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 sm:px-8 sm:pt-[max(1.75rem,env(safe-area-inset-top))] sm:pb-7">
            <Logo
              tone="light"
              className="pointer-events-auto relative z-10 inline-flex h-10 items-center leading-none"
            />
          </div>

          <nav className="relative z-[2] flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-y-auto px-5 pb-6 sm:gap-5 sm:px-8 md:gap-6">
            {links.map((link) => {
              const active =
                !link.external &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

              const itemClass = cn(
                "mobile-menu-link font-[family-name:var(--font-display)] text-[1.85rem] font-semibold leading-none tracking-[0.16em] uppercase sm:text-[2.25rem] sm:tracking-[0.18em] md:text-[2.5rem]",
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
                    onClick={() => onOpenChange(false)}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={shouldPrefetchRoute(link.href)}
                  className={itemClass}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-[2] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 sm:px-8">
            <SocialLinks layout="menu" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
