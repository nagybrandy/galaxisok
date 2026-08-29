// src/components/night-atmosphere.tsx
// Fixed, viewport-sized lights crop. Same size on every page.

import Image from "next/image";

export function NightAtmosphere() {
  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="night-atmosphere-wash" />
      <div className="night-atmosphere-photo">
        <Image
          src="/atmosphere-lights.jpg"
          alt=""
          fill
          priority
          unoptimized
          sizes="(max-width: 52rem) 78vw, 52rem"
          className="object-cover object-left-bottom"
        />
      </div>
      <div className="night-atmosphere-dots" />
      <div className="night-atmosphere-dither" />
    </div>
  );
}
