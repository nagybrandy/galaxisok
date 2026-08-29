// src/components/bandcamp-frame.tsx
// Full-viewport Bandcamp page with a hover-expand exit control.

import { BandcampExit } from "./bandcamp-exit";

type BandcampFrameProps = {
  src: string;
  title: string;
};

export function BandcampFrame({ src, title }: BandcampFrameProps) {
  return (
    <div className="relative z-[1] flex h-dvh flex-col pt-[max(5rem,calc(env(safe-area-inset-top)+3.75rem))] sm:pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))]">
      <div className="relative min-h-0 flex-1">
        <iframe
          src={src}
          title={title}
          className="h-full w-full border-0 bg-[#111]"
          allow="payment; fullscreen; autoplay"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <BandcampExit href={src} />
      </div>
    </div>
  );
}
