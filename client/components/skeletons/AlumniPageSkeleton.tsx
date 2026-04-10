import { Skeleton } from "@/components/ui/skeleton";

interface AlumniPageSkeletonProps {
  count?: number;
}

export default function AlumniPageSkeleton({
  count = 10,
}: AlumniPageSkeletonProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 min-[420px]:grid-cols-5 gap-3 w-full px-1 sm:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="alumni-skeleton-glow flex flex-col items-center gap-2 w-full"
          >
            <div className="relative w-full">
              <Skeleton className="w-full aspect-square rounded-2xl bg-zinc-800/80" />
              <Skeleton className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-yellow-500/60" />
            </div>
            <Skeleton className="h-3 w-4/5 rounded bg-zinc-800/70" />
          </div>
        ))}
      </div>

      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="alumni-skeleton-glow flex flex-col items-center gap-4 bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800"
          >
            <Skeleton className="w-44 h-44 rounded-full bg-zinc-800" />
            <div className="space-y-3 w-full flex flex-col items-center">
              <Skeleton className="h-6 w-3/4 bg-zinc-800" />
              <Skeleton className="h-4 w-1/2 bg-zinc-800" />
              <div className="flex gap-4 mt-4 pt-4">
                <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
                <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
                <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
