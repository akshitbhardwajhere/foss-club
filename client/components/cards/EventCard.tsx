"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, Calendar, MapPin, Sparkles, Tag, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { motion } from "framer-motion";

interface Speaker {
  id: string;
  name: string;
  role: string;
  imageUrl?: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  category?: string;
  registrationConfig?: any;
  isDateTentative?: boolean;
  speakers?: Speaker[];
}

interface EventCardProps {
  event: Event;
  index: number;
}

function SpeakerAvatarStack({ speakers = [] }: { speakers: Speaker[] }) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {speakers.slice(0, 3).map((speaker) => {
        const initials = speaker.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div
            key={speaker.id}
            title={`${speaker.name} - ${speaker.role}`}
            className="relative w-7 h-7 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[9px] font-bold text-zinc-300 shrink-0"
          >
            {speaker.imageUrl ? (
              <Image
                src={speaker.imageUrl}
                alt={speaker.name}
                fill
                sizes="28px"
                className="rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        );
      })}
      {speakers.length > 3 && (
        <div className="w-7 h-7 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-550 shrink-0">
          +{speakers.length - 3}
        </div>
      )}
    </div>
  );
}

export default function EventCard({ event, index }: EventCardProps) {
  const eventSlug = `${slugify(event.title)}-${event.id}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const eventDate = new Date(event.date);
  const isLive = now.toDateString() === eventDate.toDateString();
  const isActuallyPast = eventDate < now && !isLive;

  const formattedDate = event.isDateTentative
    ? `${
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][new Date(event.date).getMonth()]
      } ${new Date(event.date).getFullYear()}`
    : new Date(event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link href={`/events/${eventSlug}`} className="block h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.45 }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-[24px] p-[1px] bg-zinc-900/60 transition-all duration-300 h-full flex flex-col group cursor-pointer"
      >
        {/* Dynamic Vercel Border Glow spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(8, 183, 79, 0.45), transparent 70%)`,
          }}
        />

        {/* Inner Card Container */}
        <div className="relative bg-[#0b0c0f]/95 rounded-[23px] overflow-hidden flex flex-col grow">
          {/* Subtle cursor light on background */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(8, 183, 79, 0.04), transparent 70%)`,
            }}
          />

          {event.imageUrl ? (
            <div className="relative w-full h-44 overflow-hidden shrink-0 border-b border-zinc-900/80">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
              
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-4 h-4 text-[#08B74F]" />
              </div>

              <div className="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
                {event.category && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/85 text-zinc-300 border border-zinc-800/80">
                    {event.category}
                  </span>
                )}
                {isLive ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-950/90 text-red-400 border border-red-900/30">
                    Live
                  </span>
                ) : isActuallyPast ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800">
                    Completed
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="w-full h-44 bg-zinc-900/60 flex items-center justify-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#08B74F]/20 rounded-full" />
              </div>
              <Sparkles className="w-8 h-8 text-zinc-700 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 to-transparent" />
            </div>
          )}

          <div className="p-6 flex flex-col grow relative z-10">
            <h2 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-[#08B74F] transition-colors line-clamp-1 leading-snug">
              {event.title}
            </h2>

            <p className="text-zinc-400 text-xs mb-5 line-clamp-2 leading-relaxed grow">
              {event.description}
            </p>

            <div className="space-y-2 pt-3 border-t border-zinc-900/80 mb-5">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Calendar className="w-4 h-4 text-zinc-650 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-450">
                <MapPin className="w-4 h-4 text-zinc-650 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mt-auto border-t border-zinc-900/60 pt-4 gap-3">
              <div className="flex items-center gap-2">
                {event.speakers && event.speakers.length > 0 ? (
                  <>
                    <SpeakerAvatarStack speakers={event.speakers} />
                    <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                      {event.speakers.length === 1 ? "1 host" : `${event.speakers.length} hosts`}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-800" />
                    {event.isDateTentative ? "Tentative" : "Scheduled"}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#08B74F]">
                {isLive ? "Join" : "Details"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
