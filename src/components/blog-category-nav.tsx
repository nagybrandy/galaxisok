// src/components/blog-category-nav.tsx
// Title plus a left-side category list on desktop, wrapping row on small screens.

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { blogListHref } from "@/lib/blog";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/lib/wordpress";

type BlogCategoryNavProps = {
  categories: BlogCategory[];
  active?: string;
};

export function BlogCategoryNav({ categories, active }: BlogCategoryNavProps) {
  return (
    <Suspense fallback={<CategoryBar categories={categories} active={active} />}>
      <CategoryNavFromUrl categories={categories} fallbackActive={active} />
    </Suspense>
  );
}

type CategoryNavFromUrlProps = {
  categories: BlogCategory[];
  fallbackActive?: string;
};

function CategoryNavFromUrl({
  categories,
  fallbackActive,
}: CategoryNavFromUrlProps) {
  const searchParams = useSearchParams();

  return (
    <CategoryBar
      categories={categories}
      active={searchParams.get("kategoria") ?? fallbackActive}
    />
  );
}

type CategoryBarProps = {
  categories: BlogCategory[];
  active?: string;
};

function CategoryBar({ categories, active }: CategoryBarProps) {
  return (
    <header className="lg:sticky lg:top-24">
      <h1 className="page-title text-glow">Blog</h1>
      <nav aria-label="Kategóriák" className="mt-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:flex-col lg:items-start lg:gap-2.5">
          <li>
            <CategoryLink href={blogListHref()} active={!active}>
              Összes
            </CategoryLink>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryLink
                href={blogListHref(category.slug)}
                active={active === category.slug}
              >
                {category.name}
                <span className="ml-1.5 text-white/35">{category.count}</span>
              </CategoryLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

type CategoryLinkProps = {
  href: string;
  active: boolean;
  children: ReactNode;
};

function CategoryLink({ href, active, children }: CategoryLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "blog-category-link inline-flex min-h-8 items-center font-[family-name:var(--font-display)] text-[11px] tracking-[0.22em] uppercase",
        active ? "is-active text-white" : "text-white/50 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
