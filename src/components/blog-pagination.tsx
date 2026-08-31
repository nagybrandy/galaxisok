// src/components/blog-pagination.tsx
// Centered previous / current / next. No category or page-number strip.

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { blogListHref } from "@/lib/blog";

type BlogPaginationProps = {
  page: number;
  totalPages: number;
};

export function BlogPagination({ page, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const previousHref = blogListHref(page - 1);
  const nextHref = blogListHref(page + 1);

  return (
    <nav aria-label="Lapozás" className="blog-pager">
      {page > 1 ? (
        <Link href={previousHref} prefetch={false} className="blog-pager-step" aria-label="Előző oldal">
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </Link>
      ) : (
        <span className="blog-pager-step is-disabled" aria-hidden>
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </span>
      )}

      <p className="blog-pager-status">
        {page} / {totalPages}
      </p>

      {page < totalPages ? (
        <Link href={nextHref} prefetch={false} className="blog-pager-step" aria-label="Következő oldal">
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </Link>
      ) : (
        <span className="blog-pager-step is-disabled" aria-hidden>
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </span>
      )}
    </nav>
  );
}
