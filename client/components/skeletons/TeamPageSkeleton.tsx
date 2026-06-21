import { Skeleton } from "@/components/ui/skeleton";

interface TeamPageSkeletonProps {
  count?: number;
}

export default function TeamPageSkeleton({
  count = 10,
}: TeamPageSkeletonProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 min-[420px]:grid-cols-5 gap-3 w-full px-1">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="team-skeleton-glow flex flex-col items-center gap-2 w-full"
          >
            <Skeleton className="w-full aspect-square rounded-2xl bg-zinc-800/80" />
            <Skeleton className="h-3 w-4/5 rounded bg-zinc-800/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
