// src/components/comment-count.tsx
// Speech bubble plus the approved comment count; optionally links to the comments.

import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type CommentCountProps = {
  count: number;
  href?: string;
  className?: string;
};

export function CommentCount({ count, href, className }: CommentCountProps) {
  const label = `${count} hozzászólás`;
  const classes = cn(
    "comment-count inline-flex items-center gap-1 font-[family-name:var(--font-display)] text-xs tracking-[0.08em] whitespace-nowrap",
    className,
  );
  const body = (
    <>
      <MessageCircle className="size-3.5" aria-hidden />
      <span>{count}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(classes, "hover:underline")}
        aria-label={label}
        title={label}
      >
        {body}
      </a>
    );
  }

  return (
    <span className={classes} aria-label={label} title={label} role="img">
      {body}
    </span>
  );
}
