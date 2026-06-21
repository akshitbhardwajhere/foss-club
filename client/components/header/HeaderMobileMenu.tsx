"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Headset,
  Info,
  Menu,
  Users,
  BookOpen,
  House,
  Image as ImageIcon,
  GraduationCap,
  X,
} from "lucide-react";
import { navlinks } from "@/data/navlinks";

const icons: Record<string, React.ElementType> = {
  "/": House,
  "/events": Calendar,
  "/gallery": ImageIcon,
  "/blogs": BookOpen,
  "/team": Users,
  "/alumni": GraduationCap,
  "/about": Info,
  "/contact": Headset,
};

interface HeaderMobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HeaderMobileMenu({ open, onOpenChange }: HeaderMobileMenuProps) {
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    onOpenChange(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger trigger — only visible below lg */}
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label="Open navigation menu"
        className="lg:hidden flex items-center justify-center w-10 h-10 text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Full-screen sidebar overlay — mirrors Sheryians design */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[70] flex flex-col bg-[#050B08] lg:hidden transition-all duration-500 ease-in-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Top bar — brand + close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/50">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="text-xl font-bold tracking-tight text-white"
          >
            FOSS <span className="text-zinc-500 font-medium">NIT Srinagar</span>
          </Link>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-10 h-10 text-zinc-400"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Nav links — vertically centered, large, clean */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6 py-8">
          {navlinks.map((link) => {
            const Icon = icons[link.href] ?? House;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className={`group flex items-center gap-4 w-full max-w-xs px-5 py-4 rounded-2xl text-xl font-light tracking-widest transition-all duration-200 ${
                  isActive
                    ? "text-[#08B74F] bg-[#08B74F]/8"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                <Icon
                  className={`w-6 h-6 shrink-0 transition-colors ${
                    isActive ? "text-[#08B74F]" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                {link.name}
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#08B74F]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="px-6 py-8 border-t border-zinc-800/50">
          <Link
            href="/contact"
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center w-full py-4 rounded-2xl bg-[#08B74F] text-black font-bold text-lg tracking-wide hover:bg-[#08B74F]/90 transition-colors shadow-[0_0_24px_rgba(8,183,79,0.25)]"
          >
            Join Us
          </Link>
        </div>
      </div>
    </>
  );
}
