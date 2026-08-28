// src/components/night-atmosphere.tsx
// Bottom-left field glow only. Poster type stays off the page.

import Image from "next/image";

export function NightAtmosphere() {
  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="night-atmosphere-wash" />
      <div className="night-atmosphere-photo">
        <Image
          src="/atmosphere-lights.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-left-bottom"
        />
      </div>
      <div className="night-atmosphere-dots" />
      <div className="night-atmosphere-dither" />
    </div>
  );
}
