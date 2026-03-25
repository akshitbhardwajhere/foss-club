'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * PageTransition Component
 * 
 * A global wrapper responsible for smoothly fading and sliding new routes into view.
 * Utilizes Framer Motion's `<AnimatePresence>` logic wrapped around `next/navigation`.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.main
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
      className="flex-grow flex flex-col"
    >
      {children}
    </motion.main>
  );
}
