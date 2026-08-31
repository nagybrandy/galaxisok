// src/components/post-breadcrumb.tsx
// Főoldal → Blog → post. Last crumb is the current page.

import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Crumb =
  | { kind: "link"; href: string; label: string }
  | { kind: "current"; label: string };

type PostBreadcrumbProps = {
  title: string;
};

function crumbKey(crumb: Crumb): string {
  switch (crumb.kind) {
    case "link":
      return crumb.href;
    case "current":
      return "current";
    default: {
      const _never: never = crumb;
      return _never;
    }
  }
}

export function PostBreadcrumb({ title }: PostBreadcrumbProps) {
  const crumbs: Crumb[] = [
    { kind: "link", href: "/", label: "Főoldal" },
    { kind: "link", href: "/blog", label: "Blog" },
    { kind: "current", label: title },
  ];

  return (
    <nav aria-label="Morzsamenü">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.18em] text-white/45 uppercase">
        {crumbs.map((crumb, index) => (
          <li key={crumbKey(crumb)} className="flex min-w-0 items-center gap-2">
            {index > 0 ? (
              <ChevronRight
                aria-hidden
                className="size-3 shrink-0 self-center text-white/30"
                strokeWidth={1.75}
              />
            ) : null}
            {crumb.kind === "current" ? (
              <span className="min-w-0 truncate text-white/70">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="crumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
