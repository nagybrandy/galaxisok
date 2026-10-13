// src/lib/comments.ts
// Reads approved comments and securely relays anonymous submissions to WordPress moderation.

import { Buffer } from "node:buffer";

import { stripHtml } from "@/lib/wordpress";

const DEFAULT_WORDPRESS_URL = "https://admin.galaxisok.hu";
const COMMENT_PAGE_SIZE = 100;

type WpComment = {
  id: number;
  parent: number;
  author?: number;
  author_name: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  status?: string;
};

type WpCommentError = {
  code?: string;
  message?: string;
};

export type BlogComment = {
  id: number;
  parentId: number;
  authorName: string;
  isAdmin: boolean;
  date: string;
  content: string;
};

export type NewBlogComment = {
  postId: number;
  parentId?: number;
  authorName: string;
  authorEmail: string;
  content: string;
};

export type CommentSubmissionResult =
  | { ok: true; pending: boolean }
  | { ok: false; message: string; status: number };

function wordpressUrl(): string {
  const raw = process.env.WORDPRESS_URL ?? DEFAULT_WORDPRESS_URL;
  return raw.replace(/\/$/, "");
}

function commentAuthorization(): string | null {
  const username = process.env.WORDPRESS_COMMENT_USERNAME;
  const applicationPassword =
    process.env.WORDPRESS_COMMENT_APPLICATION_PASSWORD;

  if (!username || !applicationPassword) {
    return null;
  }

  return `Basic ${Buffer.from(`${username}:${applicationPassword}`).toString("base64")}`;
}

function mapComment(comment: WpComment): BlogComment {
  return {
    id: comment.id,
    parentId: comment.parent,
    authorName: stripHtml(comment.author_name) || "Névtelen",
    // Registered WordPress users (author > 0) are site admins/editors; anonymous visitors are 0.
    isAdmin: (comment.author ?? 0) > 0,
    date: comment.date_gmt.endsWith("Z")
      ? comment.date_gmt
      : `${comment.date_gmt}Z`,
    content: stripHtml(comment.content.rendered),
  };
}

const ALWAYS_RESERVED_NAMES = ["admin", "administrator", "galaxisok"];

export function normalizeCommentName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\(\s*admin\s*\)/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function reservedNames(): Set<string> {
  const configured = (process.env.COMMENT_RESERVED_NAMES ?? "")
    .split(",")
    .map(normalizeCommentName)
    .filter(Boolean);
  return new Set([...ALWAYS_RESERVED_NAMES, ...configured]);
}

/** True when an anonymous visitor tries to use an admin/reserved name. */
export async function isReservedCommentName(
  name: string,
  postId: number,
): Promise<boolean> {
  const normalized = normalizeCommentName(name);
  if (!normalized) {
    return true;
  }

  const reserved = reservedNames();
  const existing = await getApprovedComments(postId);
  for (const comment of existing) {
    if (comment.isAdmin) {
      reserved.add(normalizeCommentName(comment.authorName));
    }
  }

  return reserved.has(normalized) || normalized.includes("admin");
}

export async function getApprovedComments(
  postId: number,
): Promise<BlogComment[]> {
  try {
    const response = await fetch(
      `${wordpressUrl()}/wp-json/wp/v2/comments?post=${postId}&status=approve&per_page=${COMMENT_PAGE_SIZE}&orderby=date&order=asc`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "Galaxisok/1.0",
        },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      return [];
    }

    const comments = (await response.json()) as WpComment[];
    return comments
      .map(mapComment)
      .filter((comment) => comment.content.length > 0);
  } catch {
    return [];
  }
}

/**
 * Approved comment count per post for posts the plugin did not annotate.
 * One request per page of 100 comments; a band blog never needs more than a few.
 */
export async function getCommentCounts(
  postIds: number[],
): Promise<Map<number, number>> {
  const counts = new Map<number, number>(postIds.map((id) => [id, 0]));
  if (postIds.length === 0) {
    return counts;
  }

  const base = `${wordpressUrl()}/wp-json/wp/v2/comments?post=${postIds.join(",")}&status=approve&per_page=${COMMENT_PAGE_SIZE}&_fields=id,post`;

  try {
    for (let page = 1; page <= 5; page += 1) {
      const response = await fetch(`${base}&page=${page}`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "Galaxisok/1.0",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        break;
      }

      const rows = (await response.json()) as Array<{ post: number }>;
      for (const row of rows) {
        counts.set(row.post, (counts.get(row.post) ?? 0) + 1);
      }

      const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);
      if (page >= totalPages || rows.length < COMMENT_PAGE_SIZE) {
        break;
      }
    }
  } catch {
    // WordPress unreachable: keep the zeros rather than failing the page.
  }

  return counts;
}

export async function submitComment(
  comment: NewBlogComment,
): Promise<CommentSubmissionResult> {
  try {
    const authorization = commentAuthorization();
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Galaxisok/1.0",
    };
    const body: Record<string, string | number> = {
      post: comment.postId,
      parent: comment.parentId ?? 0,
      content: comment.content,
    };

    if (authorization) {
      headers.Authorization = authorization;
      body.status = "hold";
    } else {
      body.author_name = comment.authorName;
      body.author_email = comment.authorEmail;
    }

    const response = await fetch(`${wordpressUrl()}/wp-json/wp/v2/comments`, {
      method: "POST",
      cache: "no-store",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as
        | WpCommentError
        | null;
      return {
        ok: false,
        status: response.status,
        message:
          response.status === 429
            ? "Túl sok hozzászólás érkezett. Próbáld újra később."
            : error?.message || "A hozzászólást most nem sikerült elküldeni.",
      };
    }

    const created = (await response.json()) as WpComment;

    if (authorization) {
      const updateResponse = await fetch(
        `${wordpressUrl()}/wp-json/wp/v2/comments/${created.id}`,
        {
          method: "POST",
          cache: "no-store",
          headers,
          body: JSON.stringify({
            author_name: comment.authorName,
            author_email: comment.authorEmail,
            content: comment.content,
            status: "hold",
          }),
          signal: AbortSignal.timeout(12_000),
        },
      );

      if (!updateResponse.ok) {
        await fetch(
          `${wordpressUrl()}/wp-json/wp/v2/comments/${created.id}?force=true`,
          {
            method: "DELETE",
            cache: "no-store",
            headers,
            signal: AbortSignal.timeout(12_000),
          },
        ).catch(() => null);

        return {
          ok: false,
          status: 502,
          message: "A hozzászólást most nem sikerült elküldeni.",
        };
      }
    }

    return {
      ok: true,
      pending: created.status !== "approved",
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "A WordPress jelenleg nem érhető el. Próbáld újra később.",
    };
  }
}
