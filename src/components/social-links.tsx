// src/components/social-links.tsx
// Compact header row, or large two-row tap targets in the mobile menu.

"use client";

import type { SocialKind } from "@/lib/socials";
import { SOCIALS } from "@/lib/socials";
import { cn } from "@/lib/utils";

import { SocialIcon } from "./social-icon";

type SocialLinksLayout = "compact" | "menu";

type SocialLinksProps = {
  className?: string;
  tone?: "light" | "dark";
  layout?: SocialLinksLayout;
};

function iconClass(kind: SocialKind, layout: SocialLinksLayout): string {
  if (layout === "menu") {
    return "size-7";
  }

  switch (kind) {
    case "instagram":
      return "size-[18px]";
    case "facebook":
      return "size-[18px]";
    case "youtube":
      return "size-[19px]";
    case "spotify":
      return "size-[17px]";
    case "apple":
      return "size-[18px]";
    case "deezer":
      return "size-[17px]";
    case "bandcamp":
      return "size-[16px]";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function SocialLinks({
  className,
  tone = "light",
  layout = "compact",
}: SocialLinksProps) {
  return (
    <ul
      className={cn(
        layout === "menu"
          ? "social-links-menu mx-auto flex max-w-[17.5rem] flex-wrap items-center justify-center gap-x-3 gap-y-3"
          : "flex items-center",
        className,
      )}
    >
      {SOCIALS.map((social) => (
        <li key={social.kind}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
            className={cn(
              "social-link",
              layout === "menu" && "is-menu",
              tone === "light" ? "text-white/80" : "text-foreground",
            )}
          >
            <span className="social-link-sparks" aria-hidden />
            <SocialIcon
              kind={social.kind}
              className={cn("social-link-icon", iconClass(social.kind, layout))}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
