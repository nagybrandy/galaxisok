// src/components/embed-gate.tsx
// Third-party iframes wait until the visitor allows embed cookies.

"use client";

import { useEffect, useState, type ReactNode } from "react";

import { openCookieSettings, readConsent } from "@/lib/consent";

type EmbedGateProps = {
  children: ReactNode;
  label: string;
};

export function EmbedGate({ children, label }: EmbedGateProps) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAllowed(Boolean(readConsent()?.embeds));
      setReady(true);
    };
    sync();
    window.addEventListener("galaxisok:consent-changed", sync);
    return () => window.removeEventListener("galaxisok:consent-changed", sync);
  }, []);

  if (!ready) {
    return <div className="min-h-40 bg-[#050b1c]" />;
  }

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="max-w-md text-sm leading-6 text-white/65">
        A {label} külső sütiket használ. Ha engedélyezed a beágyazásokat, itt
        jelenik meg.
      </p>
      <button
        type="button"
        className="h-10 bg-white px-5 text-[11px] tracking-[0.22em] text-[#050b1c] uppercase hover:bg-white/90"
        onClick={openCookieSettings}
      >
        Sütik beállítása
      </button>
    </div>
  );
}
