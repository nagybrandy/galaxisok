// src/components/skeleton-image.tsx
// Optimized Next.js image with stable fill sizing and priority support.

"use client";

import Image from "next/image";
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
  sizes,
  unoptimized = false,
  onClick,
}: SkeletonImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      onClick={onClick}
    />
  );
}
