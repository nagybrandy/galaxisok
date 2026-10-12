// src/app/blog/[slug]/page.tsx
// Single WordPress post with cover image.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CommentsSection } from "@/components/comments-section";
import { PageShell } from "@/components/page-shell";
import { PostBackButton } from "@/components/post-back-button";
import { PostBody } from "@/components/post-body";
import { PostBreadcrumb } from "@/components/post-breadcrumb";
import { SkeletonImage } from "@/components/skeleton-image";
import { getApprovedComments } from "@/lib/comments";
import { SITE_NAME, siteUrl } from "@/lib/site";
import {
  type BlogPost,
  formatHuNumericDate,
  getPostBySlug,
} from "@/lib/wordpress";

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

  const description = post.seoDescription || post.excerpt || post.title;

  return {
    // A Yoast title already carries the site name, so skip the layout template.
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.image ? [{ url: post.image.src, alt: post.image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description,
      images: post.image ? [post.image.src] : undefined,
    },
  };
}

function postJsonLd(post: BlogPost): string {
  const base = siteUrl();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    datePublished: post.date,
    url: `${base}/blog/${post.slug}`,
    mainEntityOfPage: `${base}/blog/${post.slug}`,
    image: post.image ? [post.image.src] : undefined,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "MusicGroup", name: SITE_NAME },
    publisher: { "@type": "MusicGroup", name: SITE_NAME, url: base },
    inLanguage: "hu",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getApprovedComments(post.id);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: postJsonLd(post) }}
      />
      <article className="relative z-[1] mx-auto w-full max-w-5xl flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="post-toolbar">
          <PostBreadcrumb title={post.title} />
          <PostBackButton href="/blog" />
        </div>
        <time
          dateTime={post.date}
          className="block font-[family-name:var(--font-display)] text-sm font-light text-white/55"
        >
          {formatHuNumericDate(post.date)}
        </time>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,4rem)] leading-[1.08] font-semibold text-white">
          {post.title}
        </h1>
        <div className="post-author">
          <Image
            src={post.author?.avatar ?? "/benedek-avatar.jpg"}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="post-author-avatar"
            aria-hidden
          />
          <p className="font-[family-name:var(--font-display)] text-sm font-light text-white/55">
            {post.author?.name ?? "Galaxisok"}
          </p>
        </div>
        {post.image ? (
          <div className="post-hero mb-8">
            <div className="post-hero-photo">
              <SkeletonImage
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                unoptimized
                sizes="(min-width: 1280px) 1280px, 68vw"
                className="object-cover object-[center_28%]"
              />
            </div>
          </div>
        ) : null}
        <PostBody html={post.content} />
        <CommentsSection postId={post.id} initialComments={comments} />
      </article>
    </PageShell>
  );
}
