"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import { Loader2, Image as ImageIcon, Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  imageUrl?: string;
  date: string;
}

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
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500 group h-full flex flex-col">
                  {evt.imageUrl ? (
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-zinc-800/50 flex flex-col items-center justify-center relative">
                      <ImageIcon className="w-12 h-12 text-zinc-600 mb-2" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow -mt-12 relative z-10">
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[#08B74F] transition-colors drop-shadow-md">
                      {evt.title}
                    </h2>
                    
                    <div className="mt-auto flex items-center gap-2 text-zinc-400 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-[#08B74F]" />
                      <span>
                        {new Date(evt.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    </div>
                    
                    <div className="mt-6 flex items-center text-[#08B74F] font-bold text-sm tracking-wide gap-2 group-hover:gap-4 transition-all">
                      VIEW GALLERY <span className="text-lg">→</span>
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
