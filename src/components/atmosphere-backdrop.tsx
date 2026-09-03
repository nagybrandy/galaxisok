// src/components/atmosphere-backdrop.tsx
// Solid backdrop for the mobile menu.

type AtmosphereBackdropProps = {
  priority?: boolean;
};

export function AtmosphereBackdrop(_props: AtmosphereBackdropProps) {
  return <div className="atmosphere-backdrop" aria-hidden />;
}
