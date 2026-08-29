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
  priority = false,
  variant = "list",
}: PostCoverProps) {
  if (variant === "hero") {
    return (
      <div className="relative mt-8 aspect-[16/10] max-h-[46dvh] overflow-hidden rounded-xl bg-black/40 sm:max-h-[58dvh]">
        <SkeletonImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover object-[center_28%]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-28 shrink-0 self-stretch overflow-hidden rounded-xl bg-black/40",
        "sm:w-44 lg:w-52",
      )}
    >
      <SkeletonImage
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 7rem"
        className="object-cover object-[center_28%]"
      />
      <span className="teaser-cover-sparks" aria-hidden />
    </div>
  );
}
