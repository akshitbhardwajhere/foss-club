"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Sparkles, Tag, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { slugify, stripHtml } from "@/lib/utils";

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

interface FeaturedEventHeroProps {
  event: Event;
  isLive: boolean;
}

function SpeakerAvatarStack({ speakers = [] }: { speakers: Speaker[] }) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2.5 overflow-hidden">
      {speakers.slice(0, 4).map((speaker) => {
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
            className="relative w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0"
          >
            {speaker.imageUrl ? (
              <Image
                src={speaker.imageUrl}
                alt={speaker.name}
                fill
                sizes="32px"
                className="rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        );
      })}
      {speakers.length > 4 && (
        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-550 shrink-0">
          +{speakers.length - 4}
        </div>
      )}
    </div>
  );
}

export default function FeaturedEventHero({
  event,
  isLive,
}: FeaturedEventHeroProps) {
  const eventSlug = `${slugify(event.title)}-${event.id}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
        month: "long",
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mb-10"
    >
      <Link href={`/events/${eventSlug}`} className="group block">
        <article
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative overflow-hidden rounded-3xl p-[1px] bg-zinc-800/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_24px_60px_-20px_rgba(8,183,79,0.18)]"
        >
          {/* Dynamic Vercel Border Glow spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(8, 183, 79, 0.45), transparent 70%)`,
            }}
          />

          <div className="relative bg-[#0b0c0f]/95 rounded-[23px] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Subtle cursor light on background */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(8, 183, 79, 0.035), transparent 70%)`,
              }}
            />

            {event.imageUrl ? (
              <div className="relative h-56 sm:h-64 lg:h-80 overflow-hidden relative z-10">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-zinc-950/80" />
              </div>
            ) : (
              <div className="relative h-56 sm:h-64 lg:h-80 bg-zinc-900/60 flex items-center justify-center overflow-hidden relative z-10">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-[#08B74F]/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#08B74F]/15 rounded-full" />
                </div>
                <Sparkles className="w-16 h-16 text-zinc-700 relative z-10" />
              </div>
            )}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 bg-red-950/50 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Live Now
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/25 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {event.category && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {event.category}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-[#08B74F] transition-colors duration-300">
                {event.title}
              </h2>

              <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {stripHtml(event.description)}
              </p>

              <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-xs text-zinc-500 mb-6 border-t border-zinc-900/60 pt-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#08B74F]" />
                  <span className="text-zinc-300 font-medium">{formattedDate}</span>
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800" />
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#08B74F] shrink-0" />
                  <span className="text-zinc-300 font-medium truncate">{event.location}</span>
                </span>
                {event.isDateTentative && (
                  <>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-450">Tentative</span>
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 mt-auto pt-2 border-t border-zinc-900/60">
                {event.speakers && event.speakers.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <SpeakerAvatarStack speakers={event.speakers} />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {event.speakers.length} {event.speakers.length === 1 ? "speaker" : "speakers"}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#08B74F] group-hover:gap-3 transition-all duration-300">
                  View details
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
