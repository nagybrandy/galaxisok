// src/lib/image-placeholder.ts
// Tiny dark stand-in so photos can blur in before the real file arrives.

export const IMAGE_BLUR_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><rect width="100%" height="100%" fill="#0a1228"/></svg>',
  );
