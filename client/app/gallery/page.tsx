"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import { Loader2, Image as ImageIcon, Calendar, Images } from "lucide-react";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  imageUrl?: string;
  date: string;
}

/**
 * GalleryPage Component
 * 
 * The main public-facing photo gallery for the FOSS club.
 * Exclusively fetches and displays past/completed events that have an associated `imageUrl` or gallery content.
 * Serves as an atmospheric entry point before users click into specific event photo albums.
 */
export default function GalleryPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        // Filter only completed events for the public gallery as well
        const completedEvents = res.data.filter((evt: any) => {
            const now = new Date();
            const eventDate = new Date(evt.date);
            const isLive = now.toDateString() === eventDate.toDateString();
            return eventDate < now && !isLive;
        });
        // Sort by newest first
        const sorted = completedEvents.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(sorted);
      } catch (err) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <PageHeader title="Event Gallery" />
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-16 text-lg">
          Explore memories and moments from our past events.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#08B74F]" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-zinc-400 text-center py-12">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => (
              <Link key={evt.id} href={`/gallery/${evt.id}`}>
                <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.15)] transition-all duration-500 group h-full flex flex-col p-3">
                  {/* Image Container with photo album feel */}
                  <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden bg-zinc-800/50 mb-4 shadow-md overflow-hidden">
                    {evt.imageUrl ? (
                      <Image
                        src={evt.imageUrl}
                        alt={evt.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-zinc-700 mb-4" />
                      </div>
                    )}
                    {/* Glassy Overlay Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                         <Images className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="px-4 pb-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[#08B74F] text-xs font-bold mb-3 tracking-wider uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#08B74F] transition-colors line-clamp-2">
                       {evt.title}
                    </h2>

                    <div className="mt-auto pt-4 flex items-center text-zinc-400 font-medium text-sm transition-colors group-hover:text-white">
                       Enter Gallery <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2 text-[#08B74F]">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
