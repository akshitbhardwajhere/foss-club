"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, MessageSquare, Terminal } from "lucide-react";

import { Speaker } from "./types";

interface SpeakerGridProps {
  speakers?: Speaker[];
}

export default function SpeakerGrid({ speakers = [] }: SpeakerGridProps) {
  if (!speakers || speakers.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-zinc-900/20 border border-zinc-800/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 mt-10">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Terminal className="w-5 h-5 text-[#08B74F]" /> Hosts & Speakers
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker, index) => (
          <motion.div
            key={speaker.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden"
          >
            {/* Corner Glow decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#08B74F]/2.5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shrink-0 group-hover:border-[#08B74F]/40 transition-colors">
                <img
                  src={speaker.imageUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(speaker.name)}`}
                  alt={speaker.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white leading-tight">
                  {speaker.name}
                </h4>
                <p className="text-xs text-[#08B74F] font-semibold mt-0.5">
                  {speaker.role}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {speaker.org}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4 min-h-[48px]">
              {speaker.bio}
            </p>

            <div className="flex items-center gap-2 pt-3 border-t border-zinc-900/60">
              {speaker.github && (
                <a
                  href={speaker.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all hover:bg-zinc-800"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {speaker.linkedin && (
                <a
                  href={speaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-[#0A66C2] hover:border-zinc-700 transition-all hover:bg-zinc-800"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-zinc-600 group-hover:text-zinc-550 transition-colors">
                <MessageSquare className="w-3 h-3" />
                <span>Mentoring</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
