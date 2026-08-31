// src/components/wp-copy.tsx
// WordPress HTML for Rólunk (justified) and Kontakt (centered).

import { cn } from "@/lib/utils";

type WpCopyVariant = "about" | "contact";

type WpCopyProps = {
  html: string;
  variant: WpCopyVariant;
};

function variantClass(variant: WpCopyVariant): string {
  switch (variant) {
    case "about":
      return "is-about";
    case "contact":
      return "is-contact";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function WpCopy({ html, variant }: WpCopyProps) {
  return (
    <div
      className={cn("wp-copy", variantClass(variant))}
      lang="hu"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
