// src/components/grain-overlay.tsx
// Film-grain layer over the hero so the photo feels a little analog.

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="hero-grain pointer-events-none absolute inset-0 z-[1]"
    />
  );
}
