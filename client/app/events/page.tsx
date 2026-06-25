"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Calendar, Sparkles, Clock, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationControls from "@/components/shared/PaginationControls";
import { getStaggeredMotionPresets } from "@/lib/motion";
import { Skeleton } from "@/components/ui/skeleton";
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
  isDateTentative?: boolean;
  speakers?: Speaker[];
}

const ITEMS_PER_PAGE = 6;

function SpeakerAvatarStack({ speakers = [] }: { speakers: Speaker[] }) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-1.5 shrink-0">
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
            className="relative w-6 h-6 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-350 shrink-0"
          >
            {speaker.imageUrl ? (
              <Image
                src={speaker.imageUrl}
                alt={speaker.name}
                fill
                sizes="24px"
                className="rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        );
      })}
      {speakers.length > 3 && (
        <div className="w-6 h-6 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[7px] font-bold text-zinc-500 shrink-0">
          +{speakers.length - 3}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming" | "completed">("all");
  const [monthSort, setMonthSort] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);

  const { containerVariants, itemVariants } = getStaggeredMotionPresets({
    childStagger: 0.04,
    itemOffsetY: 12,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, monthSort]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        // Error silently handled
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const sortedFilteredEvents = useMemo(() => {
    const now = new Date();

    const filtered = events.filter((evt) => {


      const eventDate = new Date(evt.date);
      const isLive = now.toDateString() === eventDate.toDateString();
      const isActuallyPast = eventDate < now && !isLive;

      if (filter === "live") return isLive;
      if (filter === "upcoming") return !isActuallyPast && !isLive;
      if (filter === "completed") return isActuallyPast;
      return true;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return monthSort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [events, filter, monthSort]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedFilteredEvents.length / ITEMS_PER_PAGE)),
    [sortedFilteredEvents.length]
  );

  const paginatedEvents = useMemo(
    () =>
      sortedFilteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [sortedFilteredEvents, currentPage]
  );

  const sortLabel = monthSort === "asc" ? "Oldest First" : "Newest First";

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <BackgroundBlur />

      {/* Floating high-end ambient glow spheres */}
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-10 w-[550px] h-[550px] rounded-full bg-[#08B74F]/3 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full bg-[#03B77F]/2.5 blur-[130px] pointer-events-none"
      />

      <motion.div
        className="max-w-6xl mx-auto w-full z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Tag Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-xs font-semibold mx-auto w-fit"
        >
          <Calendar className="w-3.5 h-3.5" />
          Club Schedule
        </motion.div>

        {/* Header Title */}
        <PageHeader
          title={
            <>
              Club{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">
                Events
              </span>
            </>
          }
        />

        {/* Subtitle Description */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-center text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Milestones, workshops, and coding challenges hosted by FOSS Club NIT Srinagar.
        </motion.p>

        {/* Match Count Badge */}
        {!loading && sortedFilteredEvents.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-[#08B74F]" />
              <span className="text-zinc-450">
                <span className="text-white font-bold">{sortedFilteredEvents.length}</span>{" "}
                {sortedFilteredEvents.length === 1 ? "event matches" : "events matches"}
              </span>
            </div>
          </motion.div>
        )}

        {/* Search & Sort Panel */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8 pb-6 border-b border-zinc-900"
        >
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {(["all", "live", "upcoming", "completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-xs font-semibold capitalize tracking-wide transition-all ${
                  filter === t
                    ? "bg-[#08B74F] text-black font-bold"
                    : "bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>



          <div className="flex items-center gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Sort events"
                  className="px-4 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-350 hover:text-white hover:border-[#08B74F]/40 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#08B74F]" />
                  {sortLabel}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl"
              >
                <DropdownMenuRadioGroup
                  value={monthSort}
                  onValueChange={(value) => setMonthSort(value as "asc" | "desc")}
                >
                  <DropdownMenuRadioItem value="asc" className="text-xs font-semibold py-2">
                    Date: Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc" className="text-xs font-semibold py-2">
                    Date: Newest First
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Content Listing (Table View) */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 w-full rounded-2xl bg-zinc-900/20 border border-zinc-900 flex items-center justify-between px-6"
              >
                <Skeleton className="h-4 w-24 bg-zinc-900" />
                <Skeleton className="h-4 w-48 bg-zinc-900" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : sortedFilteredEvents.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 px-6 rounded-3xl border border-zinc-800/60 bg-zinc-900/30 max-w-sm mx-auto"
          >
            <Sparkles className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-300 text-sm font-medium mb-1">
              No events found
            </p>
            <p className="text-zinc-500 text-xs">
              Try adjusting your filters.
            </p>
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md overflow-hidden">
            {/* Table Header Row (Desktop only) */}
            <div className="hidden md:flex items-center justify-between py-4 px-6 border-b border-zinc-900/80 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-black/10">
              <div className="w-[15%]">Date</div>
              <div className="w-[12%]">Status</div>
              <div className="w-[50%]">Event</div>
              <div className="w-[13%]">Venue</div>
              <div className="w-[10%] text-right">Link</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-900/80">
              {paginatedEvents.map((evt) => {
                const now = new Date();
                const eventDate = new Date(evt.date);
                const isLive = now.toDateString() === eventDate.toDateString();
                const isActuallyPast = eventDate < now && !isLive;

                const eventSlug = `${slugify(evt.title)}-${evt.id}`;

                const formattedDate = evt.isDateTentative
                  ? `${
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][new Date(evt.date).getMonth()]
                    } ${new Date(evt.date).getFullYear()}`
                  : new Date(evt.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    });

                const formattedYear = new Date(evt.date).getFullYear();

                return (
                  <motion.div
                    key={evt.id}
                    variants={itemVariants}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between py-5 px-6 hover:bg-zinc-900/10 transition-all duration-300 gap-4"
                  >
                    {/* Linear Left Hover Glow */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#08B74F] opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Columns */}

                    {/* Date Column */}
                    <div className="w-full md:w-[15%] flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2">
                      <div className="flex md:flex-col items-baseline md:items-start gap-1">
                        <span className="text-sm font-bold text-white tracking-wide">
                          {formattedDate}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold">
                          {formattedYear}
                        </span>
                      </div>
                      
                      {/* Mobile Status Tag */}
                      <div className="md:hidden">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/30">
                            Live
                          </span>
                        ) : isActuallyPast ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900/70 text-zinc-400 border border-zinc-800">
                            Past
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#08B74F]/10 text-[#08B74F] border border-[#08B74F]/20">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Column (Desktop) */}
                    <div className="hidden md:block md:w-[12%]">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-950/80 text-red-400 border border-red-900/30">
                          <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                          Live
                        </span>
                      ) : isActuallyPast ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900/70 text-zinc-400 border border-zinc-800">
                          Past
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#08B74F]/10 text-[#08B74F] border border-[#08B74F]/20">
                          Upcoming
                        </span>
                      )}
                    </div>

                    {/* Event Info Column */}
                    <div className="w-full md:w-[50%] flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Link href={`/events/${eventSlug}`} className="hover:underline">
                          <h3 className="text-sm font-bold text-white group-hover:text-[#08B74F] transition-colors truncate max-w-xs md:max-w-md">
                            {evt.title}
                          </h3>
                        </Link>
                        {evt.category && (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                            {evt.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate pr-2">
                        {stripHtml(evt.description)}
                      </p>
                    </div>

                    {/* Location Column */}
                    <div className="w-full md:w-[13%] flex items-center justify-between md:justify-start gap-1 text-xs text-zinc-400 min-w-0">
                      <span className="text-[11px] text-zinc-550 md:hidden font-medium">Venue</span>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    {/* Action Column */}
                    <div className="w-full md:w-[10%] flex md:justify-end justify-center pt-2 md:pt-0">
                      <Link
                        href={`/events/${eventSlug}`}
                        className={`w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 md:py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isLive
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {isLive ? "Join" : "Details"}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
