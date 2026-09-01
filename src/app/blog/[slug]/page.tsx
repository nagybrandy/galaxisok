// src/app/blog/[slug]/page.tsx
// Single WordPress post with cover image.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { PostBackButton } from "@/components/post-back-button";
import { PostBody } from "@/components/post-body";
import { PostBreadcrumb } from "@/components/post-breadcrumb";
import { PostCover } from "@/components/post-cover";
import { SkeletonImage } from "@/components/skeleton-image";
import { formatHuDate, getPostBySlug } from "@/lib/wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const maxDuration = 30;

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

  return (
    <PageShell>
      <article className="relative z-[1] mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <PostBreadcrumb title={post.title} />
          </div>
          <PostBackButton href="/blog" />
        </div>
        <h1 className="page-title page-title-lg mt-6 text-glow">{post.title}</h1>
        <div className="mt-6 flex items-center gap-3">
          {post.author?.avatar ? (
            <span className="relative inline-block size-10 overflow-hidden rounded-full">
              <SkeletonImage
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </span>
          ) : null}
          <div>
            <p className="text-sm text-white/85">
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
    </PageShell>
  );
}
