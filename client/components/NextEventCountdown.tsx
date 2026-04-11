import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import CountdownHeader from "@/components/next-event-countdown/CountdownHeader";
import CountdownBlocks from "@/components/next-event-countdown/CountdownBlocks";
import RegistrationCallToAction from "@/components/next-event-countdown/RegistrationCallToAction";
import {
  buildRegistrationLink,
  getTimeLeft,
  isEventLive,
} from "@/components/next-event-countdown/helpers";
import type {
  NextEvent,
  TimeLeft,
} from "@/components/next-event-countdown/types";

/**
 * NextEventCountdown Component
 *
 * A sticky floating widget that surfaces the most immediate upcoming event to the user.
 * Fetches the `/api/events/next` endpoint on mount and orchestrates a local interval to countdown
 * visually via Framer Motion animations. Also detects if the event naturally starts today ("Live Now").
 */
export default function NextEventCountdown() {
  const [event, setEvent] = useState<NextEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const res = await api.get("/api/events/next");
        if (res.data) {
          const eventData = res.data;
          setEvent(eventData);

          if (eventData.registrationConfig) {
            const isValid =
              new Date(eventData.registrationConfig.validUntil) > new Date();
            if (isValid) {
              setIsRegistrationOpen(true);
              setRegistrationLink(buildRegistrationLink(eventData));
            } else {
              setIsRegistrationClosed(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch next event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => getTimeLeft(event.date);

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);

      // If time ran out, we could optionally refresh the next event here
      if (!newTime) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const isLive = event ? isEventLive(event.date) : false;

  if (loading || !event || (!timeLeft && !isLive)) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: 1,
        x: 0,
        width: isCollapsed ? "48px" : "auto",
        height: isCollapsed ? "48px" : "auto",
      }}
      transition={{
        layout: { duration: 0.6, type: "spring", bounce: 0.3 },
        opacity: { duration: 0.4 },
        x: { delay: 0.5, duration: 0.6 },
      }}
      className={`mb-8 2xl:mb-0 w-full ${isCollapsed ? "max-w-none" : "max-w-xl"} mx-auto 2xl:fixed 2xl:top-32 2xl:right-8 2xl:w-auto 2xl:max-w-sm z-40 pointer-events-auto group/countdown`}
    >
      <div className="relative w-full h-full">
        {/* Toggle Button - Only visible on 2xl where fixed */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }}
          className="hidden 2xl:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full items-center justify-center text-zinc-400 hover:text-[#08B74F] hover:border-[#08B74F]/50 transition-colors z-50 cursor-pointer shadow-lg"
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div
          onClick={() => isCollapsed && setIsCollapsed(false)}
          className={`
                        bg-zinc-900/60 backdrop-blur-xl 2xl:backdrop-blur-md border border-zinc-800/50 hover:border-[#08B74F]/50 
                        transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] 2xl:shadow-2xl 
                        ${
                          isCollapsed
                            ? "rounded-full w-12 h-12 flex items-center justify-center p-0 cursor-pointer hover:bg-[#08B74F]/20"
                            : "rounded-2xl p-4 sm:p-5 group-hover:shadow-[0_0_40px_rgba(8,183,79,0.15)] group-hover:-translate-y-1"
                        }
                    `}
        >
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-[#08B74F]"
              >
                <CalendarClock className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 md:gap-5 min-w-70"
              >
                <Link
                  href={`/events/${event.id}`}
                  className="block group w-full"
                >
                  <CountdownHeader isLive={isLive} title={event.title} />

                  <div className="w-full h-px bg-zinc-800/50 my-1 opacity-50" />

                  <div className="flex flex-col w-full items-center justify-center">
                    {event.isDateTentative ? (
                      <div className="text-sm md:text-base font-bold text-zinc-300 px-6 py-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-inner group-hover:border-[#08B74F]/30 transition-colors uppercase tracking-widest text-center mb-2 mt-2 w-full">
                        Coming in{" "}
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    ) : (
                      <CountdownBlocks
                        timeLeft={
                          timeLeft ?? {
                            days: 0,
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                          }
                        }
                      />
                    )}
                    <RegistrationCallToAction
                      isRegistrationOpen={isRegistrationOpen}
                      isRegistrationClosed={isRegistrationClosed}
                      registrationLink={registrationLink}
                      onRegister={(link) => {
                        window.location.href = link;
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
