// src/app/blog/[slug]/page.tsx
// Single WordPress post with cover image and padding-placed hearts.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { PostBackButton } from "@/components/post-back-button";
import { PostBody } from "@/components/post-body";
import { PostBreadcrumb } from "@/components/post-breadcrumb";
import { PostCover } from "@/components/post-cover";
import { PostHearts } from "@/components/post-hearts";
import { blogListHref } from "@/lib/blog";
import { formatHuDate, getPostBySlug, getPosts } from "@/lib/wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Bejegyzés" };
  }

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription || post.excerpt || post.title,
    openGraph: post.image
      ? {
          images: [{ url: post.image.src }],
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = post.categories[0];

  return (
    <PageShell>
      <div className="post-stage relative mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8">
        <article
          data-post-article
          className="relative z-[1] mx-auto w-full max-w-3xl py-12"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <PostBreadcrumb title={post.title} category={category} />
            </div>
            <PostBackButton href={blogListHref(category?.slug)} />
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl tracking-[0.12em] text-glow uppercase sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="text-sm text-white/85">
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
          {post.image ? (
            <PostCover
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              variant="hero"
              priority
            />
          ) : null}
          <div className="mt-8">
            <PostBody html={post.content} />
          </div>
        </article>
        <div className="heart-shelf mx-auto mb-10 h-24 max-w-3xl sm:h-12" aria-hidden />
        <PostHearts postId={post.id} />
      </div>
    </PageShell>
  );
}
