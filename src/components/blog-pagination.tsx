// src/components/blog-pagination.tsx
// Mobile uses large prev/next targets; desktop keeps numbered pages.

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { blogListHref } from "@/lib/blog";
import { cn } from "@/lib/utils";

type BlogPaginationProps = {
  kategoria?: string;
  page: number;
  totalPages: number;
};

export function BlogPagination({
  kategoria,
  page,
  totalPages,
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const previousHref = blogListHref(kategoria, page - 1);
  const nextHref = blogListHref(kategoria, page + 1);

  return (
    <nav aria-label="Lapozás" className="blog-pager">
      {page > 1 ? (
        <Link href={previousHref} prefetch={false} className="blog-pager-step" aria-label="Előző oldal">
          <ChevronLeft className="size-6 sm:hidden" strokeWidth={1.75} />
          <span className="hidden sm:inline">Előző</span>
        </Link>
      ) : (
        <span className="blog-pager-step is-disabled" aria-hidden>
          <ChevronLeft className="size-6 sm:hidden" strokeWidth={1.75} />
          <span className="hidden sm:inline">Előző</span>
        </span>
      )}

      <p className="blog-pager-status">
        {page} / {totalPages}
      </p>

      <ul className="blog-pager-pages">
        {pages.map((item) => (
          <li key={item}>
            <Link
              href={blogListHref(kategoria, item)}
              prefetch={false}
              aria-current={item === page ? "page" : undefined}
              aria-label={`${item}. oldal`}
              className={cn("blog-pager-page", item === page && "is-active")}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {page < totalPages ? (
        <Link href={nextHref} prefetch={false} className="blog-pager-step" aria-label="Következő oldal">
          <ChevronRight className="size-6 sm:hidden" strokeWidth={1.75} />
          <span className="hidden sm:inline">Következő</span>
        </Link>
      ) : (
        <span className="blog-pager-step is-disabled" aria-hidden>
          <ChevronRight className="size-6 sm:hidden" strokeWidth={1.75} />
          <span className="hidden sm:inline">Következő</span>
        </span>
      )}
    </nav>
  );
}
