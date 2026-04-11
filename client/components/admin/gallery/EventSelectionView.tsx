"use client";

import { Calendar, Images } from "lucide-react";
import type { EventItem } from "./types";

interface EventSelectionViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export default function EventSelectionView({
  events,
  onSelectEvent,
}: EventSelectionViewProps) {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full min-h-screen">
      <div className="mb-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#08B74F]/10 border border-[#08B74F]/20 text-[#08B74F] font-bold text-sm tracking-wide mb-4">
            <Images className="w-4 h-4" /> EVENT GALLERY
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Manage Galleries
          </h1>
          <p className="text-zinc-400 mt-3 text-lg max-w-2xl">
            Select a completed event to meticulously organize and upload memory
            showcases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 cursor-pointer hover:border-[#08B74F]/50 hover:bg-zinc-800/80 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#08B74F]/20 flex items-center justify-center text-[#08B74F]">
                →
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#08B74F] transition-colors leading-tight mb-3 pr-8">
              {evt.title}
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-xs font-semibold text-zinc-400 mt-auto">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {new Date(evt.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
