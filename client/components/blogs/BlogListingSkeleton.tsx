"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface BlogListingSkeletonProps {
  showFeatured?: boolean;
  count?: number;
}

export default function BlogListingSkeleton({
  showFeatured = true,
  count = 6,
}: BlogListingSkeletonProps) {
  return (
    <div className="space-y-10">
      {showFeatured && (
        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Skeleton className="h-56 sm:h-64 lg:h-80 rounded-none bg-zinc-800/60" />
            <div className="p-6 sm:p-8 lg:p-10 space-y-4">
              <Skeleton className="h-6 w-28 rounded-full bg-zinc-800" />
              <Skeleton className="h-10 w-full bg-zinc-800" />
              <Skeleton className="h-10 w-4/5 bg-zinc-800" />
              <Skeleton className="h-16 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-48 bg-zinc-800" />
              <Skeleton className="h-5 w-32 bg-zinc-800" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden"
          >
            <Skeleton className="h-44 w-full rounded-none bg-zinc-800/60" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-5 w-20 rounded-full bg-zinc-800" />
              <Skeleton className="h-7 w-full bg-zinc-800" />
              <Skeleton className="h-7 w-3/4 bg-zinc-800" />
              <Skeleton className="h-14 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
