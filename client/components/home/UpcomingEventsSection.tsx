"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
  imageUrl?: string;
  registrationConfig?: { validUntil: string; eventName: string };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/events")
      .then((res) => {
        const now = new Date();
        const upcoming = (res.data as Event[])
          .filter((e) => new Date(e.date) > now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 1);
        setEvents(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4">
            What&apos;s Coming
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Upcoming Events
          </h2>
          <p className="mt-3 text-zinc-400 text-lg max-w-xl">
            Workshops, hackathons, CTFs, and talks — all free for the community.
          </p>
        </div>
        <Link
          href="/events"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#08B74F] hover:text-white transition-colors shrink-0"
        >
          View all events
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#08B74F]" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-zinc-800/60 bg-zinc-900/20 text-center">
          <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
          <p className="text-zinc-400 text-lg font-medium">No upcoming events right now</p>
          <p className="text-zinc-600 text-sm mt-1">Check back soon — something exciting is brewing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => {
            const regOpen =
              event.registrationConfig &&
              new Date(event.registrationConfig.validUntil) > new Date();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden hover:border-[#08B74F]/40 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(8,183,79,0.12)] transition-all duration-300"
              >
                {/* Image / Placeholder */}
                <div className="relative w-full aspect-video bg-zinc-800/60 overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#08B74F]/10 to-zinc-900">
                      <Calendar className="w-10 h-10 text-[#08B74F]/40" />
                    </div>
                  )}
                  {/* Live badge if today */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#08B74F]/90 text-black">
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#08B74F] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-1.5 text-sm text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-[#08B74F]" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-[#08B74F]" />
                      {formatTime(event.date)}
                    </span>
                    {event.venue && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#08B74F]" />
                        {event.venue}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {regOpen ? (
                      <Link
                        href={`/events/registration/${event.registrationConfig!.eventName}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#08B74F] text-black text-sm font-bold hover:bg-[#08B74F]/90 transition-colors"
                      >
                        Register Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/events/${event.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-semibold hover:border-zinc-500 hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
