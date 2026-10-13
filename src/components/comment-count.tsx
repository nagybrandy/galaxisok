// src/components/comment-count.tsx
// "3 hozzászólás" line under a post title; optionally links to the comments.

import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type CommentCountProps = {
  count: number;
  href?: string;
  className?: string;
};

export function commentCountLabel(count: number): string {
  if (count === 0) {
    return "Még nincs hozzászólás";
  }

  return `${count} hozzászólás`;
}

export function CommentCount({ count, href, className }: CommentCountProps) {
  const label = commentCountLabel(count);
  const classes = cn(
    "comment-count inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase",
    className,
  );

  if (href) {
    return (
      <a href={href} className={cn(classes, "hover:underline")}>
        <MessageCircle className="size-3.5" aria-hidden />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <span className={classes}>
      <MessageCircle className="size-3.5" aria-hidden />
      <span>{label}</span>
    </span>
  );
}
