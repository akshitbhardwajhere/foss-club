"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TimeLeft } from "./types";

interface CountdownBlocksProps {
  timeLeft: TimeLeft;
}

export default function CountdownBlocks({ timeLeft }: CountdownBlocksProps) {
  const blocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours.toString().padStart(2, "0") },
    { label: "Mins", value: timeLeft.minutes.toString().padStart(2, "0") },
    { label: "Secs", value: timeLeft.seconds.toString().padStart(2, "0") },
  ];

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex items-center justify-center gap-2 md:gap-2 shrink-0">
        {blocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 flex items-center justify-center mb-1 group-hover:border-[#08B74F]/30 transition-colors shadow-inner">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={block.value}
                  initial={{ y: 10, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -10, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-lg sm:text-xl md:text-xl font-black text-white tabular-nums tracking-tighter"
                >
                  {block.value}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[8px] sm:text-[9px] md:text-[9px] font-semibold text-zinc-500 uppercase tracking-widest">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
