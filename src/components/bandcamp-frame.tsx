// src/components/bandcamp-frame.tsx
// Full-viewport Bandcamp page with a hover-expand exit control.

import { BandcampExit } from "./bandcamp-exit";

type BandcampFrameProps = {
  src: string;
  title: string;
};

export function BandcampFrame({ src, title }: BandcampFrameProps) {
  return (
    <div className="relative z-[1] flex h-dvh flex-col pt-20 sm:pt-24">
      <div className="min-h-0 flex-1">
        <iframe
          src={src}
          title={title}
          className="h-full w-full border-0 bg-[#111]"
          allow="payment; fullscreen; autoplay"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <BandcampExit href={src} />
    </div>
  );
}
