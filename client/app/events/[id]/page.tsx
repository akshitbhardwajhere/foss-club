"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import EventActionRow from "@/components/events/detail/EventActionRow";
import EventStatusBadge from "@/components/events/detail/EventStatusBadge";
import {
  buildEventStatus,
  formatEventDate,
} from "@/components/events/detail/helpers";
import type { EventDetail } from "@/components/events/detail/types";

/**
 * EventDetailPage Component
 *
 * Renders the full details of a single event dynamically based on the URL `[id]` parameter.
 * Also queries the backend to determine if registrations are currently open or closed,
 * and handles the native client-side downloading of PDF brochures.
 */
export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBrochureDownload = async () => {
    if (!event?.documentUrl || isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(event.documentUrl);
      if (!response.ok) throw new Error("Failed to fetch brochure");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" }),
      );

      const safeName = event.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${safeName}-brochure.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to download the brochure. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (params.id) {
          const res = await api.get(`/api/events/${params.id}`);
          setEvent(res.data);

          try {
            const configRes = await api.get(
              `/api/registration/config/${params.id}`,
            );
            const isValid = new Date(configRes.data.validUntil) > new Date();
            const isPast = new Date(res.data.date) < new Date();

            if (configRes.data && isValid && !isPast) {
              setIsRegistrationOpen(true);
              const eventNameForUrl = res.data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              setRegistrationLink(
                `/events/registration/${eventNameForUrl}?id=${params.id}`,
              );
            } else if (configRes.data && !isValid && !isPast) {
              setIsRegistrationClosed(true);
            } else {
              setIsRegistrationOpen(false);
            }
          } catch (configErr) {
            console.error("Config fetch error:", configErr);
          }
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
            <Skeleton className="w-full h-100 bg-zinc-800/60" />

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

  const status = buildEventStatus(event.date);

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
            <EventStatusBadge status={status} />
          </div>

          {event.imageUrl ? (
            <div className="relative w-full h-100">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-75 bg-zinc-800/30 flex items-center justify-center relative">
              <Calendar className="w-20 h-20 text-zinc-700" />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
            </div>
          )}

          <div className="px-8 md:px-12 pt-10 md:pt-16 pb-8 md:pb-12 relative flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-md leading-tight tracking-tight text-center z-10">
              {event.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-zinc-300 z-10">
              <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-[#08B74F]" />
                <span className="font-medium text-sm md:text-base">
                  {formatEventDate(event.date, event.isDateTentative)}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-[#08B74F]" />
                <span className="font-medium text-sm md:text-base">
                  {event.location}
                </span>
              </div>
            </div>

            {/* Action row — Register Now + Download Brochure side by side */}
            <EventActionRow
              isRegistrationOpen={isRegistrationOpen}
              isRegistrationClosed={isRegistrationClosed}
              registrationLink={registrationLink}
              hasDocument={Boolean(event.documentUrl)}
              isDownloading={isDownloading}
              onRegister={(link) => router.push(link)}
              onDownload={handleBrochureDownload}
            />

            <div
              className={`prose prose-invert max-w-3xl mx-auto text-zinc-300 text-left w-full ${!isRegistrationOpen && !isRegistrationClosed && !event.documentUrl ? "pt-8 border-t border-zinc-800/40" : ""}`}
            >
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
