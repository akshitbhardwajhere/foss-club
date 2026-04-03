"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  documentUrl?: string;
  isDateTentative?: boolean;
}

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
  const [event, setEvent] = useState<Event | null>(null);
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

  const now = new Date();
  const eventDate = new Date(event.date);
  const isToday = now.toDateString() === eventDate.toDateString();
  const isActuallyPast = eventDate < now && !isToday;
  const isLive = isToday;

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
            {isLive ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg bg-red-500/15 text-red-400 border border-red-500/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
              </div>
            ) : (
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg ${isActuallyPast ? "bg-zinc-800/90 text-zinc-300 border border-zinc-700" : "bg-[#08B74F]/90 text-black border border-[#08B74F]/50 backdrop-blur-xl"}`}
              >
                {isActuallyPast ? "Completed" : "Upcoming"}
              </span>
            )}
          </div>

          {event.imageUrl ? (
            <div className="relative w-full h-[400px]">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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
                <span className="font-medium text-sm md:text-base">
                  {event.isDateTentative
                    ? `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][new Date(event.date).getMonth()]} ${new Date(event.date).getFullYear()}`
                    : `${new Date(event.date).getDate().toString().padStart(2, "0")}/${(new Date(event.date).getMonth() + 1).toString().padStart(2, "0")}/${new Date(event.date).getFullYear()}`}
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
            {(isRegistrationOpen ||
              isRegistrationClosed ||
              event.documentUrl) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10 z-10 w-full flex flex-wrap justify-center items-center gap-4 border-t border-zinc-800/40 pt-8 mt-[-1rem]"
              >
                {/* Registration button */}
                {isRegistrationOpen ? (
                  <button
                    onClick={() => router.push(registrationLink)}
                    className="px-8 py-3.5 bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(8,183,79,0.3)] hover:shadow-[0_0_30px_rgba(8,183,79,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-1"
                  >
                    Register Now
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                ) : isRegistrationClosed ? (
                  <div className="px-8 py-3.5 bg-zinc-800 text-zinc-400 font-bold text-lg rounded-xl border border-zinc-700 flex items-center gap-2 cursor-not-allowed">
                    Registrations are closed
                  </div>
                ) : null}

                {/* Brochure download button */}
                {event.documentUrl && (
                  <button
                    onClick={handleBrochureDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-[#08B74F]/20 bg-[#08B74F]/5 hover:bg-[#08B74F]/10 hover:border-[#08B74F]/40 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#08B74F]/10 group-hover:bg-[#08B74F]/20 transition-colors shrink-0">
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 text-[#08B74F] animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#08B74F]" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white leading-none mb-0.5">
                        Agenda
                      </p>
                      <p className="text-xs text-zinc-500">
                        {isDownloading ? "Downloading…" : "Download PDF"}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-zinc-500 group-hover:text-[#08B74F] transition-colors shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                )}
              </motion.div>
            )}

            <div
              className={`prose prose-invert max-w-3xl mx-auto text-zinc-300 text-left w-full ${!isRegistrationOpen && !isRegistrationClosed ? "pt-8 border-t border-zinc-800/40" : ""}`}
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
