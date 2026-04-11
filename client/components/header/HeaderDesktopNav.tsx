"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavLinkItem {
  name: string;
  href: string;
}

interface HeaderDesktopNavProps {
  pathname?: string;
  navlinks: NavLinkItem[];
}

export default function HeaderDesktopNav({
  pathname,
  navlinks,
}: HeaderDesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2">
      {navlinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full group"
          >
            {isActive ? (
              <motion.div
                layoutId="navbar-active"
                className="absolute inset-0 bg-[#08B74F]/10 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ) : null}
            <span
              className={`relative z-10 ${isActive ? "text-[#08B74F]" : "text-zinc-400 group-hover:text-white"}`}
            >
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
