"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";

interface RosterPageLayoutProps {
  badge: ReactNode;
  title: ReactNode;
  description: string;
  containerVariants: Variants;
  itemVariants: Variants;
  children: ReactNode;
}

export default function RosterPageLayout({
  badge,
  title,
  description,
  containerVariants,
  itemVariants,
  children,
}: RosterPageLayoutProps) {
  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <BackgroundBlur />

      <motion.div
        className="w-full max-w-6xl z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4">
          {badge}
        </motion.div>

        <PageHeader title={title} />

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-lg max-w-2xl mb-16"
        >
          {description}
        </motion.p>

        {children}
      </motion.div>
    </div>
  );
}
