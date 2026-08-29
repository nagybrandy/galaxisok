// src/app/blog/page.tsx
// Multi-author WordPress feed: categories on the left, five posts per page.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BlogCategoryNav } from "@/components/blog-category-nav";
import { BlogListFade } from "@/components/blog-list-fade";
import { BlogPagination } from "@/components/blog-pagination";
import { PageShell } from "@/components/page-shell";
import { PostCover } from "@/components/post-cover";
import { parseBlogPage } from "@/lib/blog";
import { formatHuDate, getCategories, getPostsPage } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Blog",
  description: "Hírek és bejegyzések a Galaxisoktól.",
};

type BlogPageProps = {
  searchParams: Promise<{ kategoria?: string; oldal?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { kategoria, oldal } = await searchParams;
  const page = parseBlogPage(oldal);
  const [{ posts, totalPages }, categories] = await Promise.all([
    getPostsPage(kategoria, page),
    getCategories(),
  ]);

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-14">
          <BlogCategoryNav categories={categories} active={kategoria} />

          <section className="min-w-0">
            <BlogListFade listKey={`${kategoria ?? "osszes"}:${page}`}>
              {posts.length === 0 ? (
                <p className="text-white/55">
                  Itt jelennek meg a WordPressből érkező bejegyzések.
                </p>
              ) : (
                <>
                  <ul className="flex flex-col gap-8 sm:gap-10">
                    {posts.map((post) => (
                      <li key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="blog-post-teaser block">
                          <div className="flex flex-row items-stretch gap-3 sm:gap-5">
                            {post.image ? (
                              <PostCover
                                src={post.image.src}
                                alt={post.image.alt}
                                width={post.image.width}
                                height={post.image.height}
                              />
                            ) : null}
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-center gap-3">
                                {post.author?.avatar ? (
                                  <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={36}
                                    height={36}
                                    className="size-8 rounded-full object-cover sm:size-9"
                                  />
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
                                    className="text-[11px] tracking-[0.16em] text-white/40 uppercase"
                                  >
                                    {formatHuDate(post.date)}
                                  </time>
                                </div>
                              </div>
                              <h2 className="blog-post-title mt-2 text-lg font-medium tracking-tight sm:mt-4 sm:text-2xl">
                                {post.title}
                              </h2>
                              {post.excerpt ? (
                                <p className="mt-auto pt-2 line-clamp-5 max-w-2xl text-sm leading-6 text-white/60 sm:pt-3 sm:line-clamp-6 sm:text-base">
                                  {post.excerpt}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <BlogPagination
                    kategoria={kategoria}
                    page={page}
                    totalPages={totalPages}
                  />
                </>
              )}
            </BlogListFade>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
