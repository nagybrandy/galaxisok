// src/app/blog/loading.tsx
// Skeleton for the WordPress-backed listing while posts resolve.

import { InnerHeader } from "@/components/inner-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <InnerHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-5 py-12 sm:px-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </main>
    </div>
  );
}
