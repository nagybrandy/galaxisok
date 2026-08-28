// src/components/social-links.tsx
// Compact official-profile row. Hover puts the mark into the custom cursor.

"use client";

import { setCursorHover } from "@/lib/cursor-glyph";
import type { SocialKind } from "@/lib/socials";
import { SOCIALS } from "@/lib/socials";
import { cn } from "@/lib/utils";

import { SocialIcon } from "./social-icon";

type SocialLinksProps = {
  className?: string;
  tone?: "light" | "dark";
};

function iconClass(kind: SocialKind): string {
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

export function SocialLinks({ className, tone = "light" }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center", className)}>
      {SOCIALS.map((social) => (
        <li key={social.kind}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
            className={cn(
              "social-link",
              tone === "light" ? "text-white/80" : "text-foreground",
            )}
            onPointerEnter={() => setCursorHover(social.kind)}
            onPointerLeave={() => setCursorHover(null)}
          >
            <span className="social-link-halo" aria-hidden />
            <span className="social-link-sparks" aria-hidden />
            <SocialIcon kind={social.kind} className={cn("social-link-icon", iconClass(social.kind))} />
          </a>
        </li>
      ))}
    </ul>
  );
}
