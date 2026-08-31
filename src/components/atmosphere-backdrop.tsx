// src/components/atmosphere-backdrop.tsx
// Album cover plus the mobile-menu blue wash and noise.

import { ATMOSPHERE_IMAGE } from "@/lib/site";

type AtmosphereBackdropProps = {
  priority?: boolean;
};

export function AtmosphereBackdrop({ priority = false }: AtmosphereBackdropProps) {
  return (
    <div className="atmosphere-backdrop">
      <img
        src={ATMOSPHERE_IMAGE}
        alt=""
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="atmosphere-backdrop-img"
      />
      <div className="mobile-menu-noise" aria-hidden />
      <div className="mobile-menu-noise-fine" aria-hidden />
      <div className="atmosphere-backdrop-wash" />
    </div>
  );
}
