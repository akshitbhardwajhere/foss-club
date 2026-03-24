"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  registrationConfig?: any;
  isDateTentative?: boolean;
}

import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "live" | "upcoming" | "completed"
  >("all");
  const [monthSort, setMonthSort] = useState<"default" | "asc" | "desc">(
    "default",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, monthSort]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const now = new Date();
    const eventDate = new Date(evt.date);
    const isLive = now.toDateString() === eventDate.toDateString();
    const isActuallyPast = eventDate < now && !isLive;

    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "live") return isLive;
    if (filter === "upcoming") return !isActuallyPast && !isLive;
    if (filter === "completed") return isActuallyPast;
    return true;
  });

  const sortedFilteredEvents = [...filteredEvents].sort((a, b) => {
    if (monthSort === "default") return 0;

    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const monthKeyA = dateA.getFullYear() * 12 + dateA.getMonth();
    const monthKeyB = dateB.getFullYear() * 12 + dateB.getMonth();

    return monthSort === "asc" ? monthKeyA - monthKeyB : monthKeyB - monthKeyA;
  });

  const totalPages = Math.ceil(sortedFilteredEvents.length / itemsPerPage);
  const paginatedEvents = sortedFilteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const emptyFilterLabel = filter === "all" ? "" : ` ${filter}`;

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <PageHeader
          title={
            filter === "completed"
              ? "Past Events"
              : filter === "live"
                ? "Live Events"
                : filter === "upcoming"
                  ? "Upcoming Events"
                  : "All Events"
          }
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by event name/location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] transition-all placeholder:text-zinc-500"
            />
          </div>

          <div className="flex justify-center flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("live")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === "live" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
            >
              Live
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === "upcoming" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === "completed" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
            >
              Completed
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Sort events"
                  className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium ml-auto md:ml-4"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800 text-zinc-200"
              >
                <DropdownMenuRadioGroup
                  value={monthSort}
                  onValueChange={(value) =>
                    setMonthSort(value as "default" | "asc" | "desc")
                  }
                >
                  <DropdownMenuRadioItem value="default">
                    Default Sort
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">
                    Date: Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Date: Newest First
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-zinc-900/40 p-4 lg:p-6 rounded-2xl border border-zinc-800"
              >
                <Skeleton className="h-12 w-12 rounded bg-zinc-800 hidden md:block" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-1/3 bg-zinc-800" />
                  <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                </div>
                <div className="w-32 hidden lg:block">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </div>
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </div>
                <div className="w-24">
                  <Skeleton className="h-8 w-full rounded-full bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedEvents.length === 0 ? (
          <p className="text-zinc-400 text-center py-12">No{emptyFilterLabel} events found.</p>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 bg-zinc-900 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-1">No.</div>
              <div className="col-span-4 lg:col-span-5">EVENT NAME</div>
              <div className="col-span-3 lg:col-span-2">LOCATION</div>
              <div className="col-span-2">DATE & TIME</div>
              <div className="col-span-2 text-right">ACTION</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-800/50">
              {paginatedEvents.map((evt, i) => {
                const now = new Date();
                const eventDate = new Date(evt.date);
                const isLive = now.toDateString() === eventDate.toDateString();
                const isActuallyPast = eventDate < now && !isLive;
                
                const isRegistrationValid =
                  evt.registrationConfig &&
                  new Date(evt.registrationConfig.validUntil) > new Date() &&
                  !isActuallyPast;

                return (
                  <div key={evt.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 lg:px-8 py-5 items-center hover:bg-zinc-800/30 transition-colors group">
                    <div className="hidden lg:block col-span-1 text-zinc-500 font-medium text-sm">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </div>
                    
                    <div className="col-span-1 lg:col-span-5 flex items-start gap-4">
                      {evt.imageUrl && (
                        <div className="w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative hidden md:block border border-zinc-700/50">
                          <Image src={evt.imageUrl} alt="" fill sizes="56px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/events/${evt.id}`} className="flex flex-col items-start gap-1.5 mt-0.5 mb-1">
                          <h3 className="font-bold text-white text-lg group-hover:text-[#08B74F] transition-colors truncate max-w-full">{evt.title}</h3>
                          {isLive ? (
                            <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">Live</span>
                          ) : isActuallyPast ? (
                            <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">Completed</span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md bg-[#08B74F]/10 text-[#08B74F] border border-[#08B74F]/20">Upcoming</span>
                          )}
                        </Link>
                        
                        {/* Mobile only location & date */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 lg:hidden">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <MapPin className="w-3.5 h-3.5 text-[#08B74F]" />
                            <span className="truncate max-w-[150px]">{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Calendar className="w-3.5 h-3.5 text-[#08B74F]" />
                            <span>
                              {evt.isDateTentative 
                                ? new Date(evt.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                                : new Date(evt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {isLive && <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Live</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden lg:flex col-span-2 text-sm text-zinc-400 items-center gap-2">
                       <MapPin className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                       <span className="truncate">{evt.location}</span>
                    </div>
                    
                    <div className="hidden lg:flex col-span-2 text-sm flex-col justify-center">
                       <div className="flex items-center gap-2 text-zinc-300">
                         <Calendar className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                         <span className="font-medium">
                           {evt.isDateTentative
                             ? `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date(evt.date).getMonth()]} ${new Date(evt.date).getFullYear()}`
                             : `${new Date(evt.date).getDate().toString().padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date(evt.date).getMonth()]} ${new Date(evt.date).getFullYear()}`}
                         </span>
                       </div>
                       {isLive && (
                         <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-red-400 pl-6">
                           <span className="relative flex h-1.5 w-1.5">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                           </span>
                           LIVE NOW
                         </div>
                       )}
                    </div>
                    
                    <div className="col-span-1 lg:col-span-2 flex justify-start lg:justify-end mt-4 lg:mt-0">
                       <Link
                         href={`/events/${evt.id}`}
                         className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all duration-300 w-full lg:w-auto text-center border ${
                           isRegistrationValid
                             ? "bg-white text-black border-white hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                             : isLive
                               ? "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                               : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-700"
                         }`}
                       >
                         {isRegistrationValid ? "REGISTER" : isLive ? "JOIN NOW" : "VIEW DETAILS"}
                       </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-6 border-t border-zinc-800/50 bg-zinc-900/20">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        currentPage === i + 1
                          ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          : "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent hover:border-zinc-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
