"use client";

import { Calendar } from "lucide-react";

interface GalleryDatePillProps {
  date: string;
}

export default function GalleryDatePill({ date }: GalleryDatePillProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300">
      <Calendar className="w-4 h-4 text-[#08B74F]" />
      <span className="text-sm font-medium">
        {new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
}
