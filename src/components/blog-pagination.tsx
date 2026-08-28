// src/components/blog-pagination.tsx
// Numbered pager for the WordPress blog listing.

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

  return (
    <nav
      aria-label="Lapozás"
      className="mt-12 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] uppercase"
    >
      {page > 1 ? (
        <Link
          href={blogListHref(kategoria, page - 1)}
          className="blog-page-link"
        >
          Előző
        </Link>
      ) : (
        <span className="blog-page-link is-disabled">Előző</span>
      )}
      <ul className="flex flex-wrap items-center gap-2">
        {pages.map((item) => (
          <li key={item}>
            <Link
              href={blogListHref(kategoria, item)}
              aria-current={item === page ? "page" : undefined}
              className={cn("blog-page-link", item === page && "is-active")}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
      {page < totalPages ? (
        <Link
          href={blogListHref(kategoria, page + 1)}
          className="blog-page-link"
        >
          Következő
        </Link>
      ) : (
        <span className="blog-page-link is-disabled">Következő</span>
      )}
    </nav>
  );
}
