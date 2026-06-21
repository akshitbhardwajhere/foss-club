"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Joining FOSS Club was the best decision I made in college. I went from zero GitHub contributions to 300+ in a year. The mentorship here is unmatched.",
    name: "Aarav Sharma",
    role: "B.Tech CSE, 2024",
    avatar: "AS",
    color: "from-[#08B74F]/20 to-transparent",
  },
  {
    quote: "I had no idea what open source even was before FOSS Club. Now I'm a contributor to a project with 10k+ stars. The community makes it easy to take that first step.",
    name: "Priya Raina",
    role: "B.Tech ECE, 2025",
    avatar: "PR",
    color: "from-blue-500/20 to-transparent",
  },
  {
    quote: "The CTF workshops completely changed how I think about security. I cleared my first HackTheBox challenge after just two sessions with the club.",
    name: "Zaid Khan",
    role: "B.Tech IT, 2023",
    avatar: "ZK",
    color: "from-red-500/20 to-transparent",
  },
  {
    quote: "FOSS Club feels like a startup incubator inside a college. The projects are real, the code reviews are genuine, and the community genuinely cares about your growth.",
    name: "Tanvi Bhat",
    role: "B.Tech CSE, 2026",
    avatar: "TB",
    color: "from-purple-500/20 to-transparent",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4">
          Member Stories
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Hear From Our Community
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Real students. Real growth. Real impact.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col gap-5 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 relative overflow-hidden"
          >
            {/* Background gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-30 pointer-events-none`} />

            <Quote className="w-8 h-8 text-[#08B74F]/40 shrink-0" />

            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base relative">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 mt-auto relative">
              {/* Avatar initials */}
              <div className="w-9 h-9 rounded-full bg-[#08B74F]/20 border border-[#08B74F]/30 flex items-center justify-center text-xs font-bold text-[#08B74F] shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
