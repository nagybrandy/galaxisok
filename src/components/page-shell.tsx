// src/components/page-shell.tsx
// Inner page body only. Atmosphere, header, and footer live in the root layout.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  flush?: boolean;
};

export function PageShell({ children, flush = false }: PageShellProps) {
  return (
    <div
      className={cn(
        "relative z-[1] flex min-h-dvh flex-col text-white",
        !flush && "pt-20",
      )}
    >
      {children}
    </div>
  );
}
