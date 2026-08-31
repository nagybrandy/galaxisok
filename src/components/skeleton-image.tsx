// src/components/skeleton-image.tsx
// Photos arrive blurred, then ease into focus via react-lazy-load-image-component.

"use client";

import { LazyLoadImage } from "react-lazy-load-image-component";
import type { MouseEventHandler } from "react";

import { IMAGE_BLUR_PLACEHOLDER } from "@/lib/image-placeholder";
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
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      placeholderSrc={IMAGE_BLUR_PLACEHOLDER}
      threshold={140}
      visibleByDefault={priority}
      width={fill ? "100%" : width}
      height={fill ? "100%" : height}
      wrapperClassName={cn("lazy-image", fill && "is-fill")}
      className={cn("lazy-image-photo", className)}
      onClick={onClick}
    />
  );
}
