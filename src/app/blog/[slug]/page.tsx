// src/app/blog/[slug]/page.tsx
// Single WordPress post. Missing slugs fall through to the app not-found page.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { InnerFooter } from "@/components/inner-footer";
import { InnerHeader } from "@/components/inner-header";
import { PostBody } from "@/components/post-body";
import { formatHuDate, getPostBySlug, getPosts } from "@/lib/wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

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
    title: post.title,
    description: post.excerpt || post.title,
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
    <div className="flex min-h-dvh flex-col">
      <InnerHeader />
      <article className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <time
          dateTime={post.date}
          className="text-xs tracking-[0.18em] text-muted-foreground uppercase"
        >
          {formatHuDate(post.date)}
        </time>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            className="mt-8 aspect-[16/9] w-full object-cover"
            priority
          />
        ) : null}
        <div className="mt-8">
          <PostBody html={post.content} />
        </div>
      </article>
      <InnerFooter />
    </div>
  );
}
