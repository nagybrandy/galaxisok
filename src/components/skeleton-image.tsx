// src/components/skeleton-image.tsx
// Shimmer overlay while a photo arrives. The img stays visible so the browser loads it.

"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type MouseEventHandler, type SyntheticEvent } from "react";

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
  const skipOptimize = unoptimized || /^https?:\/\//.test(src);

  useLayoutEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setReady(true);
      return;
    }
    setReady(false);
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
        loading="eager"
        unoptimized={skipOptimize}
        ref={imageRef}
        onLoad={markReady}
        onError={() => setReady(true)}
        onClick={onClick}
        className={cn("image-skeleton-photo", ready && "is-ready", className)}
      />
    </>
  );
}
