// src/components/post-cover.tsx
// List thumbs stay compact; hero covers keep the full-width crop.

import { SkeletonImage } from "@/components/skeleton-image";
import { cn } from "@/lib/utils";

type PostCoverProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  variant?: "list" | "hero";
};

export function PostCover({
  src,
  alt,
  width,
  height,
  priority = false,
  variant = "list",
}: PostCoverProps) {
  if (variant === "hero") {
    return (
      <div className="relative mt-8 overflow-hidden rounded-xl bg-black/40">
        <SkeletonImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 768px) 48rem, 100vw"
          className="max-h-[46dvh] w-full object-cover object-[center_28%] sm:max-h-[58dvh]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-black/40",
        "aspect-[5/4] w-28 sm:w-44 lg:w-52",
      )}
    >
      <SkeletonImage
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 7rem"
        className="object-cover object-[center_28%]"
      />
    </div>
  );
}
