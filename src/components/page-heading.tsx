// src/components/page-heading.tsx
// Shared inner-page title. Blog / Koncertek live in the header instead.

import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export const INNER_PAGE_MAIN =
  "mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8";

export const INNER_PAGE_LIST =
  "mx-auto w-full max-w-3xl flex-1 px-5 pb-12 pt-2 sm:px-8";

export const INNER_PAGE_BLOG =
  "mx-auto w-full max-w-3xl flex-1 px-5 pb-12 pt-8 sm:px-8 sm:pt-10";

export const INNER_PAGE_TOUR =
  "mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pt-10";

export const INNER_PAGE_CENTER =
  "mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:px-8";

export const INNER_PAGE_PROSE =
  "mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-5 pb-20 pt-6 sm:px-8 sm:pt-8 sm:pb-24";

type PageHeadingProps = {
  section: string;
  className?: string;
};

export function PageHeading({ section, className }: PageHeadingProps) {
  return (
    <h1 className={cn("page-title page-title-section text-glow", className)}>
      {SITE_NAME}
      <span className="page-title-dot">·</span>
      {section}
    </h1>
  );
}
