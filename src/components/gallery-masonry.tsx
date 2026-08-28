// src/components/gallery-masonry.tsx
// Asymmetric masonry tiles plus a caption-free lightbox.

"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { SkeletonImage } from "@/components/skeleton-image";
import type { GalleryImage } from "@/lib/wordpress";

type GalleryMasonryProps = {
  images: GalleryImage[];
};

type TilePattern = 0 | 1 | 2 | 3 | 4 | 5;

function tileClass(index: number): string {
  const pattern = (index % 6) as TilePattern;

  switch (pattern) {
    case 0:
      return "sm:col-span-7 sm:row-span-2 min-h-[260px] sm:min-h-[440px]";
    case 1:
      return "sm:col-span-5 min-h-[220px] sm:min-h-[214px]";
    case 2:
      return "sm:col-span-5 min-h-[220px] sm:min-h-[214px]";
    case 3:
      return "sm:col-span-4 min-h-[220px] sm:min-h-[240px]";
    case 4:
      return "sm:col-span-8 min-h-[220px] sm:min-h-[240px]";
    case 5:
      return "sm:col-span-12 min-h-[240px] sm:min-h-[280px]";
    default: {
      const _never: never = pattern;
      return _never;
    }
  }
}

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setActive(null), []);

  const step = useCallback(
    (delta: number) => {
      setActive((current) => {
        if (current === null) {
          return current;
        }
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (active === null) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
          step(1);
          break;
        case "ArrowLeft":
          step(-1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, close, step]);

  if (images.length === 0) {
    return (
      <p className="mt-10 max-w-xl text-white/60">
        A galéria a WordPressből töltődik. Az adminban a Galéria menüpont
        alatt lehet képeket felvinni.
      </p>
    );
  }

  const current = active === null ? null : images[active];

  return (
    <>
      <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:grid-flow-dense">
        {images.map((image, index) => (
          <li key={image.id} className={`h-full ${tileClass(index)}`}>
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group relative block h-full w-full overflow-hidden"
              aria-label="Kép megnyitása"
            >
              <SkeletonImage
                src={image.src}
                alt={image.alt || "Galaxisok"}
                fill
                sizes="(min-width: 640px) 58vw, 100vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.04] group-hover:opacity-90"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[75] flex items-center justify-center bg-black"
              role="dialog"
              aria-modal="true"
              aria-label="Galéria"
              onClick={close}
            >
              <button
                type="button"
                className="absolute top-5 right-5 z-[1] text-[11px] tracking-[0.24em] text-white/70 uppercase hover:text-white"
                onClick={close}
              >
                Bezár
              </button>
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute top-1/2 left-3 z-[1] -translate-y-1/2 text-[11px] tracking-[0.24em] text-white/70 uppercase hover:text-white sm:left-8"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(-1);
                    }}
                  >
                    Előző
                  </button>
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 z-[1] -translate-y-1/2 text-[11px] tracking-[0.24em] text-white/70 uppercase hover:text-white sm:right-8"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(1);
                    }}
                  >
                    Következő
                  </button>
                </>
              ) : null}
              <div
                className="relative h-dvh w-dvw"
                onClick={(event) => event.stopPropagation()}
              >
                <SkeletonImage
                  key={current.id}
                  src={current.src}
                  alt={current.alt || "Galaxisok"}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
