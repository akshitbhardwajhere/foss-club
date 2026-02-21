"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Headset, Info, Menu, Terminal, Users, BookOpen, House } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { navlinks } from "@/data/navlinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Avoid rendering the global nav on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#050B08]/80 backdrop-blur-lg border-b border-zinc-800/50 shadow-lg py-3"
        : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-3 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group z-10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center text-[#08B74F] group-hover:scale-110 transition-transform duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#08B74F] transition-colors duration-300">
            FOSS <span className="text-zinc-500 font-medium">NIT Srinagar</span>
          </span>
        </Link>

        {/* Desktop Navigation - Absolutely centered (Hidden completely on mobile DOM to prevent overflow calculations) */}
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
                <span className={`relative z-10 ${isActive ? "text-[#08B74F]" : "text-zinc-400 group-hover:text-white"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button className="bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold rounded-full px-6 transition-all hover:scale-105 shadow-[0_0_20px_rgba(8,183,79,0.2)]">
                Join Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-zinc-950 border border-zinc-800 text-white rounded-2xl overflow-hidden shadow-2xl p-2"
              >
                {/* Home */}
                <Link href="/">
                  <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                    <House className="w-5 h-5 text-zinc-400" />
                    <span className="font-medium">Home</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuGroup>
                  {/* Events */}
                  <Link href="/events">
                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                      <Calendar className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium">Events</span>
                    </DropdownMenuItem>
                  </Link>
                  {/* Blogs */}
                  <Link href="/blogs">
                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                      <BookOpen className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium">Blogs</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                <DropdownMenuGroup>
                  {/* Team */}
                  <Link href="/team">
                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                      <Users className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium">Team</span>
                    </DropdownMenuItem>
                  </Link>
                  {/* About */}
                  <Link href="/about">
                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                      <Info className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium">About Us</span>
                    </DropdownMenuItem>
                  </Link>
                  {/* Contact */}
                  <Link href="/contact">
                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                      <Headset className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium">Contact</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
