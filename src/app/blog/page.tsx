// src/app/blog/page.tsx
// Centered WordPress feed: five posts per page, separated by a rule.

import type { Metadata } from "next";
import Link from "next/link";

import { BlogListFade } from "@/components/blog-list-fade";
import { BlogPagination } from "@/components/blog-pagination";
import { INNER_PAGE_BLOG } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { PostCover } from "@/components/post-cover";
import { SkeletonImage } from "@/components/skeleton-image";
import { parseBlogPage } from "@/lib/blog";
import { formatHuDate, getPostsPage } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export const metadata: Metadata = {
  title: "Blog",
  description: "Hírek és bejegyzések a Galaxisoktól.",
};

type BlogPageProps = {
  searchParams: Promise<{ oldal?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { oldal } = await searchParams;
  const page = parseBlogPage(oldal);
  const { posts, totalPages } = await getPostsPage(undefined, page);

  return (
    <PageShell>
      <main className={INNER_PAGE_BLOG}>
        <h1 className="sr-only">Galaxisok · Blog</h1>
        <section className="min-w-0">
          <BlogListFade listKey={String(page)}>
            {posts.length === 0 ? (
              <p className="text-white/55 font-[family-name:var(--font-fuse)]">
                Itt jelennek meg a WordPressből érkező bejegyzések.
              </p>
            ) : (
              <>
                <ul className="blog-list">
                  {posts.map((post) => (
                    <li key={post.id} className="blog-list-item py-8 first:pt-0 last:pb-0 sm:py-10">
                      <Link
                        href={`/blog/${post.slug}`}
                        prefetch={false}
                        className="blog-post-teaser block"
                      >
                        <div className="flex flex-row items-stretch gap-3 overflow-hidden sm:gap-5">
                          {post.image ? (
                            <PostCover
                              src={post.image.src}
                              alt={post.image.alt}
                              width={post.image.width}
                              height={post.image.height}
                            />
                          ) : (
                            <div
                              className="w-28 shrink-0 self-stretch rounded-xl bg-white/5 sm:w-44"
                              aria-hidden
                            />
                          )}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center gap-3">
                              {post.author?.avatar ? (
                                <span className="relative inline-block size-8 overflow-hidden rounded-full sm:size-9">
                                  <SkeletonImage
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                  />
                                </span>
                              ) : (
                                <span className="flex size-8 items-center justify-center rounded-full border border-white/20 text-[10px] tracking-[0.16em] uppercase sm:size-9">
                                  {post.author?.name.slice(0, 1) ?? "G"}
                                </span>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white/85">
                                  {post.author?.name ?? "Galaxisok"}
                                </p>
                                <time
                                  dateTime={post.date}
                                  className="text-[11px] tracking-[0.16em] text-white/40"
                                >
                                  {formatHuDate(post.date)}
                                </time>
                              </div>
                            </div>
                            <h2 className="blog-post-title mt-2 line-clamp-2 text-lg font-normal tracking-tight sm:text-2xl">
                              {post.title}
                            </h2>
                            <div className="blog-teaser-excerpt">
                              <p className="line-clamp-3 text-sm leading-6 text-white/60 sm:text-base">
                                {post.excerpt || "\u00a0"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <BlogPagination page={page} totalPages={totalPages} />
              </>
            )}
          </BlogListFade>
        </section>
      </main>
    </PageShell>
  );
}
