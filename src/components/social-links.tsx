// src/components/social-links.tsx
// Compact official-profile row used on the landing overlay and inner footers.

import { SOCIALS } from "@/lib/socials";
import { cn } from "@/lib/utils";

import { SocialIcon } from "./social-icon";

type SocialLinksProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function SocialLinks({ className, tone = "light" }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {SOCIALS.map((social) => (
        <li key={social.kind}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-opacity hover:opacity-70",
              tone === "light" ? "text-white" : "text-foreground",
            )}
          >
            <SocialIcon kind={social.kind} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
