"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Download,
  Share2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import EventStatusBadge from "@/components/events/detail/EventStatusBadge";
import CountdownTimer from "@/components/events/detail/CountdownTimer";
import EventShare from "@/components/events/detail/EventShare";
import EventAgenda from "@/components/events/detail/EventAgenda";
import SpeakerGrid from "@/components/events/detail/SpeakerGrid";
import EventFAQ from "@/components/events/detail/EventFAQ";
import { extractIdFromSlug, slugify } from "@/lib/utils";
import {
  buildEventStatus,
  formatEventDate,
} from "@/components/events/detail/helpers";
import type { EventDetail } from "@/components/events/detail/types";

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
      toast.success("Brochure downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download the brochure. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getGoogleCalendarUrl = (eventDetail: EventDetail) => {
    const startDate = new Date(eventDetail.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3-hour duration default

    const formatCalDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetail.title
    )}&dates=${formatCalDate(startDate)}/${formatCalDate(
      endDate
    )}&details=${encodeURIComponent(
      eventDetail.description
    )}&location=${encodeURIComponent(eventDetail.location)}&sf=true&output=xml`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (params.slug) {
          const id = extractIdFromSlug(params.slug as string);
          if (id) {
            const res = await api.get(`/api/events/${id}`);
            setEvent(res.data);

            const correctSlug = `${slugify(res.data.title)}-${res.data.id}`;
            if (params.slug !== correctSlug) {
              router.replace(`/events/${correctSlug}`);
            }

            try {
              const configRes = await api.get(
                `/api/registration/config/${id}`,
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
                  `/events/registration/${eventNameForUrl}?id=${id}`,
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
        }
      } catch (err) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="bg-[#030704] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans">
        <div className="max-w-6xl mx-auto w-full z-10 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-12 w-full">
            <div className="space-y-6">
              <Skeleton className="h-6 w-20 bg-zinc-900" />
              <Skeleton className="h-16 w-full bg-zinc-900 rounded-2xl" />
              <Skeleton className="h-80 w-full bg-zinc-900 rounded-3xl" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-full bg-zinc-900" />
                <Skeleton className="h-6 w-5/6 bg-zinc-900" />
                <Skeleton className="h-6 w-4/6 bg-zinc-900" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full bg-zinc-900 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-[#030704] min-h-screen flex flex-col items-center justify-center text-white">
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
    <div className="bg-[#030704] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-28 pb-20 px-4 md:px-8 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Background Cyber-Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,183,79,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,183,79,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Decorative Radial Lighting Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#08B74F]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto w-full z-10 relative">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.push("/events")}
            className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white bg-zinc-900/35 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl transition-all backdrop-blur-md shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Events</span>
          </button>

          <div className="flex items-center gap-3">
            {event.category && (
              <span className="px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/25 rounded-full backdrop-blur-sm shadow-sm">
                {event.category}
              </span>
            )}
            <EventStatusBadge status={status} />
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-12 w-full items-start">
          
          {/* LEFT COLUMN: Main Presentation & Context */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Event Badge Icon / Callout */}
              <div className="flex items-center gap-2 text-zinc-500 font-semibold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#08B74F]" />
                <span>Featured Event</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 tracking-tight leading-[1.1] pb-1">
                {event.title}
              </h1>

              {/* Date, Location, and Duration badges */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-400 pt-2 text-sm">
                <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-850 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-[#08B74F]" />
                  <span className="font-semibold text-zinc-200">
                    {formatEventDate(event.date, event.isDateTentative)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-850 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-[#08B74F]" />
                  <span className="font-semibold text-zinc-200">
                    {event.location}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Immersive Event Cover Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-850 bg-zinc-900/20 group shadow-2xl"
            >
              {event.imageUrl ? (
                <>
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    priority
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/30 gap-3">
                  <Calendar className="w-16 h-16 text-zinc-800" />
                  <span className="text-zinc-650 text-xs font-semibold uppercase tracking-widest">
                    No Preview Available
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900/20 border border-zinc-800/40 backdrop-blur-sm rounded-3xl p-6 md:p-8"
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                About the Event
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-zinc-350 text-sm md:text-base lg:text-md">
                {event.description}
              </p>
            </motion.div>

            {/* Agenda Timeline Section */}
            <EventAgenda />

            {/* Speaker & Host Profile Grids */}
            <SpeakerGrid />

            {/* Event FAQ Accordion Section */}
            <EventFAQ />
          </div>

          {/* RIGHT COLUMN: Sidebar Registration Details (Sticky) */}
          <div className="lg:sticky lg:top-28 space-y-6">
            
            {/* Live Event Countdown */}
            {!isRegistrationClosed && (
              <CountdownTimer eventDate={event.date} />
            )}

            {/* Core Registration glass card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-950/80 border border-zinc-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#08B74F] to-teal-400" />
              
              <h4 className="text-lg font-black text-white mb-2">
                Event Registration
              </h4>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Register to confirm your attendance, receive schedule reminders, and claim FOSS certification slots.
              </p>

              {/* Main Call to Action Button */}
              <div className="space-y-4">
                {isRegistrationOpen ? (
                  <button
                    onClick={() => router.push(registrationLink)}
                    className="w-full py-4 bg-[#08B74F] hover:bg-[#08B74F]/95 text-black font-extrabold text-md rounded-2xl shadow-[0_0_25px_rgba(8,183,79,0.35)] hover:shadow-[0_0_35px_rgba(8,183,79,0.6)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 font-sans"
                  >
                    <span>Register Now</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : isRegistrationClosed ? (
                  <div className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-550 font-bold text-center rounded-2xl cursor-not-allowed text-sm">
                    Registrations Closed
                  </div>
                ) : (
                  <div className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold text-center rounded-2xl cursor-not-allowed text-sm">
                    Registrations Unavailable
                  </div>
                )}

                {/* Brochure Agenda PDF Download */}
                {event.documentUrl && (
                  <button
                    onClick={handleBrochureDownload}
                    disabled={isDownloading}
                    className="w-full py-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/90 text-white font-bold text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Download className={`w-4 h-4 text-[#08B74F] ${isDownloading ? "animate-bounce" : "group-hover:translate-y-0.5"} transition-transform`} />
                    <span>{isDownloading ? "Downloading..." : "Download Agenda PDF"}</span>
                  </button>
                )}

                {/* Direct Google Calendar integration */}
                {!isRegistrationClosed && (
                  <a
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20 text-zinc-400 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-550 group-hover:text-[#08B74F]" />
                    <span>Add to Google Calendar</span>
                  </a>
                )}
              </div>

              {/* Sidebar Quick details facts */}
              <div className="mt-8 pt-6 border-t border-zinc-900 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-semibold">Attendance Capacity</span>
                  <span className="text-zinc-200 font-bold">150 Attendees Max</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-semibold">Requirement</span>
                  <span className="text-zinc-200 font-bold">BYOL (Bring Your Own Laptop)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-semibold">Admission</span>
                  <span className="text-[#08B74F] font-black uppercase tracking-wider">Free Admission</span>
                </div>
              </div>
            </motion.div>

            {/* Sharing panel widgets */}
            <EventShare title={event.title} />
          </div>

        </div>
      </div>
    </div>
  );
}
