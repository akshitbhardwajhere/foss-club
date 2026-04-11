"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardShellProps {
  index: number;
  children: ReactNode;
  className?: string;
}

export default function CardShell({
  index,
  children,
  className = "",
}: CardShellProps) {
  return (
    <motion.div
      className={`bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500 group ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
}
