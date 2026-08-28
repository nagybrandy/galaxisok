// src/lib/blog.ts
// Blog listing query helpers: category + page, always reset page on filter.

export function blogListHref(kategoria?: string, page = 1): string {
  const params = new URLSearchParams();

  if (kategoria) {
    params.set("kategoria", kategoria);
  }

  if (page > 1) {
    params.set("oldal", String(page));
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function parseBlogPage(value?: string): number {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}
