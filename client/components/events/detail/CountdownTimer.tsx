"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  eventDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(eventDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, isPast: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  if (!mounted || timeRemaining.isPast) return null;

  const timeBlocks = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hours", value: timeRemaining.hours },
    { label: "Minutes", value: timeRemaining.minutes },
    { label: "Seconds", value: timeRemaining.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-2xl p-6 mb-8 relative overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#08B74F]/5 blur-2xl rounded-full pointer-events-none" />
      
      <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-4 text-center">
        Event Starts In
      </p>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-center justify-center bg-zinc-950/70 border border-zinc-800/40 rounded-xl py-3 px-1 relative min-w-[70px] shadow-inner"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={block.value}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight"
              >
                {String(block.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] md:text-xs text-zinc-500 font-medium mt-1">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
