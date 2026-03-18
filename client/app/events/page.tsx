"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import EventCard from "@/components/cards/EventCard";
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

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === "all" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("live")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === "live" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
          >
            Live
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === "upcoming" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === "completed" ? "bg-[#08B74F] text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
          >
            Completed
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Sort events"
                className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800 text-zinc-200 data-[state=open]:duration-200 data-[state=closed]:duration-150 data-[state=open]:ease-out data-[state=closed]:ease-in"
            >
              <DropdownMenuRadioGroup
                value={monthSort}
                onValueChange={(value) =>
                  setMonthSort(value as "default" | "asc" | "desc")
                }
              >
                <DropdownMenuRadioItem value="default">
                  Default
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">
                  Month: Oldest First
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  Month: Newest First
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800"
              >
                <Skeleton className="h-[200px] w-full rounded-xl bg-zinc-800" />
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 bg-zinc-800 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedFilteredEvents.length === 0 ? (
          <p className="text-zinc-400">No{emptyFilterLabel} events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedFilteredEvents.map((evt, i) => {
              const now = new Date();
              const eventDate = new Date(evt.date);
              const isLive = now.toDateString() === eventDate.toDateString();
              const isActuallyPast = eventDate < now && !isLive;
              return (
                <EventCard
                  key={evt.id}
                  event={evt}
                  index={i}
                  isPast={isActuallyPast}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
