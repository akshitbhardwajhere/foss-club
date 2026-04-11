"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import HeaderBrand from "@/components/header/HeaderBrand";
import HeaderDesktopNav from "@/components/header/HeaderDesktopNav";
import HeaderMobileMenu from "@/components/header/HeaderMobileMenu";
import { navlinks } from "@/data/navlinks";
import { Button } from "./ui/button";
import Link from "next/link";

/**
 * Header Component
 *
 * The primary public navigation bar. Features scroll-dependent transparency,
 * advanced layout animations using Framer Motion, and a heavily optimized mobile hamburger menu hook.
 * Hidden automatically if rendered on an `/admin` route.
 */

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050B08]/80 backdrop-blur-lg border-b border-zinc-800/50 shadow-lg py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-3 flex items-center justify-between relative">
        <HeaderBrand />

        <HeaderDesktopNav pathname={pathname} navlinks={navlinks} />

        {/* Desktop CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button className="bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold rounded-full px-6 transition-all hover:scale-105 shadow-[0_0_20px_rgba(8,183,79,0.2)]">
                Join Us
              </Button>
            </Link>
          </div>

          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
