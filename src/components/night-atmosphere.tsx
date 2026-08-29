// src/components/night-atmosphere.tsx
// Full-viewport night photo behind every inner page.

import Image from "next/image";

export function NightAtmosphere() {
  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="night-atmosphere-photo">
        <Image
          src="/atmosphere.jpg"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="night-atmosphere-wash" />
      <div className="night-atmosphere-dither" />
    </div>
  );
}
