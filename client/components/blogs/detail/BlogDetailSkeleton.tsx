"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailSkeleton() {
  return (
    <div className="bg-[#050B08] text-white min-h-screen pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-4 w-28 mb-12 bg-zinc-800/80" />

        <Skeleton className="w-full aspect-[21/9] max-h-112 rounded-2xl bg-zinc-800/60 mb-12" />

        <div className="space-y-5 mb-10">
          <Skeleton className="h-4 w-24 bg-zinc-800/80" />
          <Skeleton className="h-14 w-full bg-zinc-800/80" />
          <Skeleton className="h-14 w-4/5 bg-zinc-800/80" />
          <Skeleton className="h-4 w-64 bg-zinc-800/60" />
        </div>

        <Skeleton className="h-px w-full bg-zinc-800/80 mb-12" />

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-5 bg-zinc-800/60 ${i % 3 === 2 ? "w-4/5" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
