"use client";

import type { EventStatusState } from "./types";

interface EventStatusBadgeProps {
  status: EventStatusState;
}

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  if (status.isLive) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg bg-red-500/15 text-red-400 border border-red-500/40">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        LIVE
      </div>
    );
  }

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg ${status.isPast ? "bg-zinc-800/90 text-zinc-300 border border-zinc-700" : "bg-[#08B74F]/90 text-black border border-[#08B74F]/50 backdrop-blur-xl"}`}
    >
      {status.isPast ? "Completed" : "Upcoming"}
    </span>
  );
}
