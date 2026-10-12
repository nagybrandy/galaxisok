// src/components/atmosphere-backdrop.tsx
// Reuses the homepage photo with the former blue wash and noise behind the mobile menu.

import Image from "next/image";

import { HERO_IMAGE } from "@/lib/site";

type AtmosphereBackdropProps = {
  priority?: boolean;
};

export function AtmosphereBackdrop({
  priority = false,
}: AtmosphereBackdropProps) {
  return (
    <div className="atmosphere-backdrop" aria-hidden>
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority={priority}
        unoptimized
        sizes="100vw"
        className="atmosphere-backdrop-img"
      />
      <div className="mobile-menu-noise" />
      <div className="mobile-menu-noise-fine" />
      <div className="atmosphere-backdrop-wash" />
    </div>
  );
}
