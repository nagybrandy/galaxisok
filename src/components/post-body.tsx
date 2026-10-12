// src/components/post-body.tsx
// Renders sanitized WordPress HTML; third-party iframes wait for embed consent.

"use client";

import { useEffect, useMemo, useRef } from "react";

import {
  CONSENT_CHANGED_EVENT,
  openCookieSettings,
  readConsent,
} from "@/lib/consent";
import { gateEmbeds } from "@/lib/embeds";

type PostBodyProps = {
  html: string;
};

export function PostBody({ html }: PostBodyProps) {
  const gated = useMemo(() => gateEmbeds(html), [html]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const activate = () => {
      if (!readConsent()?.embeds) {
        return;
      }
      for (const gate of root.querySelectorAll<HTMLElement>(
        ".embed-gate[data-embed-html]",
      )) {
        const markup = gate.dataset.embedHtml;
        if (!markup) {
          continue;
        }
        const holder = document.createElement("div");
        holder.innerHTML = markup;
        const frame = holder.firstElementChild;
        if (frame) {
          gate.replaceWith(frame);
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-embed-settings]")) {
        event.preventDefault();
        openCookieSettings();
      }
    };

    activate();
    root.addEventListener("click", onClick);
    window.addEventListener(CONSENT_CHANGED_EVENT, activate);
    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener(CONSENT_CHANGED_EVENT, activate);
    };
  }, [gated]);

  return (
    <div
      ref={rootRef}
      className="post-body max-w-none overflow-x-auto text-[1.125rem] leading-8 text-white/85 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-white/45 [&_figure]:my-8 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-normal [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-normal [&_h3]:text-xl [&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol_ul]:mt-2 [&_ul_ul]:mt-2"
      dangerouslySetInnerHTML={{ __html: gated }}
    />
  );
}
