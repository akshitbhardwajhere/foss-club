"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, CalendarDays } from "lucide-react";

import api from "@/lib/axios";

interface EventItem {
  date: string;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState([
    { key: "members", icon: Users, label: "Active Members", value: 0, suffix: "+", color: "text-[#08B74F]" },
    { key: "events", icon: CalendarDays, label: "Events Conducted", value: 0, suffix: "+", color: "text-[#08B74F]" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch active members and events count in parallel to eliminate request waterfall
        const [teamResponse, eventsResponse] = await Promise.all([
          api.get("/api/team"),
          api.get("/api/events"),
        ]);

        const activeMembersCount = Array.isArray(teamResponse.data) ? teamResponse.data.length : 15;

        const now = new Date();
        const completedEventsCount = Array.isArray(eventsResponse.data)
          ? eventsResponse.data.filter((e: EventItem) => new Date(e.date) < now).length
          : 3;

        setStats([
          { key: "members", icon: Users, label: "Active Members", value: activeMembersCount, suffix: "+", color: "text-[#08B74F]" },
          { key: "events", icon: CalendarDays, label: "Events Conducted", value: completedEventsCount, suffix: "+", color: "text-[#08B74F]" },
        ]);
      } catch (error) {
        console.error("Failed to fetch dynamic stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 z-10">
      <div className="grid grid-cols-2 max-w-2xl mx-auto gap-4">
        {stats.map(({ key, icon: Icon, label, value, suffix, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-[#08B74F]/30 hover:bg-zinc-900/60 transition-all duration-300 text-center overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#08B74F]/50 to-transparent" />

            <div className="w-10 h-10 rounded-xl bg-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 text-[#08B74F]" />
            </div>

            <p className={`text-3xl sm:text-4xl font-black tracking-tight ${color}`}>
              <AnimatedCounter target={value} suffix={suffix} />
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-tight">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
