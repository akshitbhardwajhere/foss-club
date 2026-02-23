"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (params.id) {
          const res = await api.get(`/api/events/${params.id}`);
          setEvent(res.data);
        }
      } catch (err) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans">
        <div className="max-w-4xl mx-auto w-full z-10 mt-12">
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Hero Image Skeleton */}
            <Skeleton className="w-full h-[400px] bg-zinc-800/60" />

            <div className="p-8 md:p-12 relative -mt-20 flex flex-col items-center">
              {/* Title Skeleton */}
              <Skeleton className="h-12 w-3/4 mb-6 bg-zinc-800" />

              {/* Meta info Skeleton */}
              <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
                <Skeleton className="h-10 w-32 rounded-full bg-zinc-800" />
                <Skeleton className="h-10 w-32 rounded-full bg-zinc-800" />
              </div>

              {/* Content Skeleton */}
              <div className="w-full max-w-3xl space-y-4">
                <Skeleton className="h-6 w-full bg-zinc-800" />
                <Skeleton className="h-6 w-11/12 bg-zinc-800" />
                <Skeleton className="h-6 w-full bg-zinc-800" />
                <Skeleton className="h-6 w-4/5 bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-[#050B08] min-h-screen flex flex-col items-center justify-center text-white">
        <p className="text-zinc-400 mb-4">Event not found.</p>
        <button
          onClick={() => router.push("/events")}
          className="text-[#08B74F] hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
      </div>
    );
  }

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#08B74F]/10 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto w-full z-10">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div
          className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-6 right-6 z-10">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg ${isPast ? "bg-zinc-800/90 text-zinc-300 border border-zinc-700" : "bg-[#08B74F]/90 text-black border border-[#08B74F]/50 backdrop-blur-xl"}`}
            >
              {isPast ? "Completed" : "Upcoming"}
            </span>
          </div>

          {event.imageUrl ? (
            <div className="relative w-full h-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-[300px] bg-zinc-800/30 flex items-center justify-center relative">
              <Calendar className="w-20 h-20 text-zinc-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>
          )}

          <div className="px-8 md:px-12 pt-10 md:pt-16 pb-8 md:pb-12 relative flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-md leading-tight tracking-tight text-center z-10">
              {event.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-zinc-300 z-10">
              <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-[#08B74F]" />
                <span className="font-medium text-sm md:text-base">{`${new Date(event.date).getDate().toString().padStart(2, "0")}/${(new Date(event.date).getMonth() + 1).toString().padStart(2, "0")}/${new Date(event.date).getFullYear()}`}</span>
              </div>
              <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-[#08B74F]" />
                <span className="font-medium text-sm md:text-base">
                  {event.location}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-3xl mx-auto text-zinc-300 text-left w-full pt-8 border-t border-zinc-800/40">
              <h3 className="text-xl font-bold text-white mb-4 block">
                Event Details
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-lg text-zinc-400">
                {event.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
