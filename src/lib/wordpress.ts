// src/lib/wordpress.ts
// Headless WordPress REST client. Posts are authored at admin.galaxisok.hu.

const DEFAULT_WORDPRESS_URL = "https://admin.galaxisok.hu";

export const WORDPRESS_CACHE_TAG = "wordpress-posts";

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

export type WpPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
  };
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  } | null;
};

function wordpressUrl(): string {
  const raw = process.env.WORDPRESS_URL ?? DEFAULT_WORDPRESS_URL;
  return raw.replace(/\/$/, "");
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

// Drops script/event handlers so WP HTML can be rendered in the blog.
export function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function mapPost(post: WpPost): BlogPost {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: post.id,
    slug: post.slug,
    title: decodeEntities(stripHtml(post.title.rendered)),
    excerpt: stripHtml(post.excerpt.rendered),
    content: sanitizeWpHtml(post.content.rendered),
    date: post.date,
    image: media?.source_url
      ? {
          src: media.source_url,
          alt: media.alt_text || decodeEntities(stripHtml(post.title.rendered)),
          width: media.media_details?.width ?? 1600,
          height: media.media_details?.height ?? 900,
        }
      : null,
  };
}

async function wpFetch<T>(path: string): Promise<T | null> {
  const url = `${wordpressUrl()}${path}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60,
        tags: [WORDPRESS_CACHE_TAG],
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await wpFetch<WpPost[]>(
    "/wp-json/wp/v2/posts?_embed=1&per_page=20&status=publish",
  );

  if (!posts) {
    return [];
  }

  return posts.map(mapPost);
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

export function formatHuDate(isoDate: string): string {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}
