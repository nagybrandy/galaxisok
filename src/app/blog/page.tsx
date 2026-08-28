// src/app/blog/page.tsx
// Public news list sourced from the WordPress REST API.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { InnerFooter } from "@/components/inner-footer";
import { InnerHeader } from "@/components/inner-header";
import { formatHuDate, getPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Blog",
  description: "Hírek és bejegyzések a Galaxisoktól.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="flex min-h-dvh flex-col">
      <InnerHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="font-[family-name:var(--font-logo)] text-3xl tracking-[0.2em] uppercase">
          Blog
        </h1>
        {posts.length === 0 ? (
          <p className="mt-8 text-muted-foreground">
            Itt jelennek meg a WordPressből érkező bejegyzések, amint az
            admin.galaxisok.hu él.
          </p>
        ) : (
          <ul className="mt-10 space-y-10">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {post.image ? (
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      width={post.image.width}
                      height={post.image.height}
                      className="mb-4 aspect-[16/9] w-full object-cover"
                    />
                  ) : null}
                  <time
                    dateTime={post.date}
                    className="text-xs tracking-[0.18em] text-muted-foreground uppercase"
                  >
                    {formatHuDate(post.date)}
                  </time>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight group-hover:opacity-70">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <InnerFooter />
    </div>
  );
}
