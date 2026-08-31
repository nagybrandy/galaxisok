// src/lib/blog.ts
// Blog listing query helpers. Page 1 has no query string.

export function blogListHref(page = 1): string {
  if (page > 1) {
    return `/blog?oldal=${page}`;
  }

  return "/blog";
}

export function parseBlogPage(value?: string): number {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}
