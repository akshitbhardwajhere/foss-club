"use client";

import { ArrowRight, CalendarClock } from "lucide-react";

interface CountdownHeaderProps {
  isLive: boolean;
  title: string;
}

export default function CountdownHeader({
  isLive,
  title,
}: CountdownHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center w-full">
      <div
        className={`flex items-center justify-center gap-1.5 font-semibold text-[10px] 2xl:text-xs mb-1.5 sm:mb-2 uppercase tracking-wider px-3 py-1 rounded-full border ${isLive ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-[#08B74F]/10 text-[#08B74F] border-[#08B74F]/20"}`}
      >
        {isLive ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        ) : (
          <CalendarClock className="w-3 2xl:w-3.5 h-3 2xl:h-3.5" />
        )}
        <span>{isLive ? "Live Now" : "Upcoming Event"}</span>
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#08B74F] transition-colors leading-tight">
        {title}
      </h3>
      <span className="text-zinc-500 text-[11px] font-medium flex items-center justify-center gap-1 group-hover:text-zinc-400 transition-colors">
        View Details{" "}
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  );
}
