// src/lib/wordpress.ts
// Headless WordPress REST client: posts, authors, categories, concerts, gallery.

const DEFAULT_WORDPRESS_URL = "https://admin.galaxisok.hu";

export const WORDPRESS_CACHE_TAG = "wordpress";

type WpRendered = {
  rendered: string;
  protected?: boolean;
};

type WpMedia = {
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
};

type WpAuthor = {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: Record<string, string>;
};

type WpTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  count?: number;
};

type WpYoast = {
  title?: string;
  description?: string;
  og_image?: { url?: string }[];
};

type WpPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  featured_media: number;
  categories?: number[];
  yoast_head_json?: WpYoast;
  _embedded?: {
    author?: WpAuthor[];
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

type WpConcert = WpPost & {
  meta?: {
    helyszin?: string;
    idopont?: string;
    jegy_url?: string;
  };
};

export type BlogAuthor = {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: BlogAuthor | null;
  categories: BlogCategory[];
  seoTitle?: string;
  seoDescription?: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  } | null;
};

export type Concert = {
  id: number;
  slug: string;
  title: string;
  description: string;
  venue: string;
  startsAt: string | null;
  ticketUrl: string | null;
};

export type GalleryImage = {
  id: number;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const WP_FETCH_ATTEMPTS = 3;

function wordpressUrl(): string {
  const raw = process.env.WORDPRESS_URL ?? DEFAULT_WORDPRESS_URL;
  return raw.replace(/\/$/, "");
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

export function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function mapImage(media: WpMedia | undefined, fallbackAlt: string) {
  if (!media?.source_url) {
    return null;
  }

  return {
    src: media.source_url,
    alt: media.alt_text || fallbackAlt,
    width: media.media_details?.width || 1600,
    height: media.media_details?.height || 900,
  };
}

function mapAuthor(author: WpAuthor | undefined): BlogAuthor | null {
  if (!author) {
    return null;
  }

  const avatar =
    author.avatar_urls?.["96"] ??
    author.avatar_urls?.["48"] ??
    Object.values(author.avatar_urls ?? {})[0] ??
    null;

  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    avatar,
  };
}

function mapCategories(post: WpPost): BlogCategory[] {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups
    .flat()
    .filter((term) => term.taxonomy === "category" && term.slug !== "uncategorized")
    .map((term) => ({
      id: term.id,
      name: decodeEntities(term.name),
      slug: term.slug,
      count: term.count ?? 0,
    }));
}

function longerExcerpt(post: WpPost): string {
  const excerpt = stripHtml(post.excerpt.rendered);
  const content = stripHtml(post.content.rendered);
  const text = excerpt.length >= 180 ? excerpt : content || excerpt;
  if (text.length <= 520) {
    return text;
  }
  return `${text.slice(0, 519).replace(/\s+\S*$/, "")}…`;
}

function mapPost(post: WpPost): BlogPost {
  const title = decodeEntities(stripHtml(post.title.rendered));
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: longerExcerpt(post),
    content: sanitizeWpHtml(post.content.rendered),
    date: post.date,
    author: mapAuthor(post._embedded?.author?.[0]),
    categories: mapCategories(post),
    seoTitle: post.yoast_head_json?.title
      ? decodeEntities(stripHtml(post.yoast_head_json.title))
      : undefined,
    seoDescription: post.yoast_head_json?.description
      ? decodeEntities(stripHtml(post.yoast_head_json.description))
      : undefined,
    image: mapImage(media, title),
  };
}

async function wpRequest(path: string): Promise<Response | null> {
  const url = `${wordpressUrl()}${path}`;

  for (let attempt = 0; attempt < WP_FETCH_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "Galaxisok/1.0",
        },
      });

      if (response.ok) {
        return response;
      }
    } catch {
      // The first WordPress hit is often cold; retry instead of caching empty.
    }

    if (attempt < WP_FETCH_ATTEMPTS - 1) {
      await sleep(300 * (attempt + 1));
    }
  }

  return null;
}

async function wpFetch<T>(path: string): Promise<T | null> {
  const response = await wpRequest(path);
  if (!response) {
    return null;
  }

  return (await response.json()) as T;
}

export async function getCategories(): Promise<BlogCategory[]> {
  const terms = await wpFetch<WpTerm[]>(
    "/wp-json/wp/v2/categories?per_page=50&hide_empty=true",
  );

  if (!terms) {
    return [];
  }

  return terms
    .filter((term) => term.slug !== "uncategorized")
    .map((term) => ({
      id: term.id,
      name: decodeEntities(term.name),
      slug: term.slug,
      count: term.count ?? 0,
    }));
}

export const BLOG_PAGE_SIZE = 5;

export type BlogPostPage = {
  posts: BlogPost[];
  page: number;
  total: number;
  totalPages: number;
};

async function categoryQuery(categorySlug?: string): Promise<string | null> {
  if (!categorySlug) {
    return "";
  }

  const categories = await getCategories();
  const match = categories.find((category) => category.slug === categorySlug);
  if (!match) {
    return null;
  }

  return `&categories=${match.id}`;
}

export async function getPosts(categorySlug?: string): Promise<BlogPost[]> {
  const extra = await categoryQuery(categorySlug);
  if (extra === null) {
    return [];
  }

  const posts = await wpFetch<WpPost[]>(
    `/wp-json/wp/v2/posts?_embed=1&per_page=100&status=publish${extra}`,
  );

  if (!posts) {
    return [];
  }

  return posts.map(mapPost);
}

export async function getPostsPage(
  categorySlug?: string,
  page = 1,
): Promise<BlogPostPage> {
  const extra = await categoryQuery(categorySlug);
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  if (extra === null) {
    return { posts: [], page: 1, total: 0, totalPages: 0 };
  }

  const response = await wpRequest(
    `/wp-json/wp/v2/posts?_embed=1&per_page=${BLOG_PAGE_SIZE}&page=${safePage}&status=publish${extra}`,
  );

  if (!response) {
    return { posts: [], page: safePage, total: 0, totalPages: 0 };
  }

  const rows = (await response.json()) as WpPost[];
  const total = Number(response.headers.get("X-WP-Total") ?? rows.length);
  const totalPages = Number(
    response.headers.get("X-WP-TotalPages") ??
      Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
  );

  return {
    posts: rows.map(mapPost),
    page: safePage,
    total,
    totalPages,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await wpFetch<WpPost[]>(
    `/wp-json/wp/v2/posts?_embed=1&slug=${encodeURIComponent(slug)}&status=publish`,
  );

  if (!posts?.[0]) {
    return null;
  }

  return mapPost(posts[0]);
}

export async function getConcerts(): Promise<Concert[]> {
  const rows = await wpFetch<WpConcert[]>(
    "/wp-json/wp/v2/koncertek?per_page=50&status=publish",
  );

  if (!rows) {
    return [];
  }

  return rows
    .map((row) => {
      const startsAt = row.meta?.idopont?.trim() || null;

      return {
        id: row.id,
        slug: row.slug,
        title: decodeEntities(stripHtml(row.title.rendered)),
        description: stripHtml(row.content.rendered || row.excerpt.rendered),
        venue: row.meta?.helyszin?.trim() || "",
        startsAt,
        ticketUrl: row.meta?.jegy_url?.trim() || null,
      };
    })
    .sort((a, b) => {
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
}

function mapGalleryRow(row: WpPost): GalleryImage[] {
  const title = decodeEntities(stripHtml(row.title.rendered));
  const image = mapImage(row._embedded?.["wp:featuredmedia"]?.[0], title);
  if (!image) {
    return [];
  }

  return [
    {
      id: row.id,
      title,
      ...image,
    },
  ];
}

function mapGalleryMedia(media: WpMedia & { id?: number; title?: WpRendered }): GalleryImage[] {
  const title = media.title?.rendered
    ? decodeEntities(stripHtml(media.title.rendered))
    : "Galaxisok";
  const image = mapImage(media, title);
  if (!image || (image.width > 0 && image.width < 400)) {
    return [];
  }

  return [
    {
      id: media.id ?? 0,
      title,
      ...image,
    },
  ];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const rows = await wpFetch<WpPost[]>(
    "/wp-json/wp/v2/galeria?_embed=1&per_page=40&status=publish",
  );
  const fromCpt = (rows ?? []).flatMap(mapGalleryRow);

  if (fromCpt.length > 0) {
    return fromCpt;
  }

  const media = await wpFetch<(WpMedia & { id?: number; title?: WpRendered })[]>(
    "/wp-json/wp/v2/media?per_page=40&media_type=image",
  );

  return (media ?? []).flatMap(mapGalleryMedia);
}

export function formatHuDate(isoDate: string): string {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

const HU_MONTHS = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
] as const;

export type HuDateTimeParts = {
  year: string;
  day: string;
  time: string;
};

export function formatHuDateTimeParts(value: string): HuDateTimeParts | null {
  const naive = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (naive) {
    const [, year, month, day, hour, minute] = naive;
    const monthName = HU_MONTHS[Number(month) - 1];
    if (!monthName) {
      return null;
    }
    return {
      year: `${year}.`,
      day: `${monthName} ${Number(day)}.`,
      time: `${hour}:${minute}`,
    };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const monthIndex = Number(
    new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      timeZone: "Europe/Budapest",
    }).format(date),
  );
  const monthName = HU_MONTHS[monthIndex - 1];
  if (!monthName) {
    return null;
  }

  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "Europe/Budapest",
  }).format(date);
  const time = new Intl.DateTimeFormat("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Budapest",
  }).format(date);

  return {
    year: `${new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      timeZone: "Europe/Budapest",
    }).format(date)}.`,
    day: `${monthName} ${day}.`,
    time,
  };
}

export function formatHuDateTime(value: string): string {
  const parts = formatHuDateTimeParts(value);
  if (parts) {
    return `${parts.year} ${parts.day} ${parts.time}`;
  }
  return value.replace("T", " ");
}
