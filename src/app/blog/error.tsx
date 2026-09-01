// src/app/blog/error.tsx
// WordPress can miss on a cold first hit; offer a retry instead of a 404.

"use client";

type BlogErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BlogError({ reset }: BlogErrorProps) {
  return (
    <main className="relative z-[1] flex min-h-[50dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-white/55">A bejegyzések most nem jöttek be. Próbáld újra.</p>
      <button
        type="button"
        className="text-sm tracking-[0.2em] uppercase underline underline-offset-4"
        onClick={() => reset()}
      >
        Újra
      </button>
    </main>
  );
}
