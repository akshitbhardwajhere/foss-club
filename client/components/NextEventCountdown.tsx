"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { slugify } from "@/lib/utils";
import type { NextEvent } from "@/components/next-event-countdown/types";

/**
 * NextEventCountdown Component
 *
 * Redesigned to replicate the event popup card from fossunited.org.
 * Card dimensions: 240px x 120px (2:1 aspect ratio), rounded border,
 * off-white card background, soft shadow, cover image taking top 75%,
 * and a status bar footer containing a pulsing green dot and
 * "Upcoming event: EVENT NAME" text.
 */
export default function NextEventCountdown() {
  const [event, setEvent] = useState<NextEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const res = await api.get("/api/events/next");
        if (res.data) {
          setEvent(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch next event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  if (loading) {
    return (
      <div className="w-[240px] h-[120px] mx-auto bg-zinc-900/40 border border-zinc-800/60 rounded-[10px] animate-pulse" />
    );
  }

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[240px] mx-auto group/countdown"
    >
      <Link
        href={`/events/${slugify(event.title)}-${event.id}`}
        className="block bg-[#fafafa] border border-[#e6e6e6] rounded-[10px] overflow-hidden transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 w-[240px] h-[120px]"
      >
        {/* Top 75% Cover Image */}
        <div className="w-full h-[75%] relative overflow-hidden bg-white">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={240}
              height={90}
              priority
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400">
              <CalendarClock className="w-6 h-6 text-zinc-300" />
            </div>
          )}
        </div>

        {/* Bottom 25% Status Footer */}
        <div className="w-full h-[25%] flex items-center justify-start gap-2 px-3 bg-white border-t border-[#e6e6e6]">
          {/* Pulsing Green Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>

          <span className="text-[10px] font-semibold text-[#383838] truncate tracking-tight">
            Upcoming event: {event.title}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
