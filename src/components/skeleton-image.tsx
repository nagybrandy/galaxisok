// src/components/skeleton-image.tsx
// Native img. Lazy-load wrappers can stick at opacity 0 after the gate.

"use client";

import type { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

type SkeletonImageProps = {
  src: string;
  alt: string;
  sizes?: string;
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
  className,
  priority = false,
  fill = false,
  width,
  height,
  onClick,
}: SkeletonImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      onClick={onClick}
    />
  );
}
