// src/components/page-shell.tsx
// Inner page body only. Atmosphere, header, and footer live in the root layout.
// Fills the space above the footer so short pages still pin the bar to the bottom.

import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative z-[1] flex flex-1 flex-col">
      {children}
    </div>
  );
}
