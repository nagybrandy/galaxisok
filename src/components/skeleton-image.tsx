// src/components/skeleton-image.tsx
// Transparent shimmer while a photo arrives, then the image fades in.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEventHandler, type SyntheticEvent } from "react";

import { cn } from "@/lib/utils";

type SkeletonImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  onClick?: MouseEventHandler<HTMLImageElement>;
};

export function SkeletonImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  fill = false,
  width,
  height,
  unoptimized = false,
  onClick,
}: SkeletonImageProps) {
  const [ready, setReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setReady(false);
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setReady(true);
    }
  }, [src]);

  const markReady = (event: SyntheticEvent<HTMLImageElement>) => {
    if (event.currentTarget.naturalWidth > 0) {
      setReady(true);
    }
  };

  return (
    <>
      <span
        aria-hidden
        className={cn("image-skeleton", ready && "is-ready")}
      />
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        ref={imageRef}
        onLoad={markReady}
        onClick={onClick}
        className={cn("image-skeleton-photo", ready && "is-ready", className)}
      />
    </>
  );
}
