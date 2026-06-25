"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import NextEventCountdown from "@/components/NextEventCountdown";
import HeroTerminal from "@/components/home/HeroTerminal";
import StatsSection from "@/components/home/StatsSection";
import DomainsSection from "@/components/home/DomainsSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import AboutSection from "@/components/home/AboutSection";
import RoadmapsSection from "@/components/home/RoadmapsSection";
import CommunitySection from "@/components/home/CommunitySection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import { getStaggeredMotionPresets } from "@/lib/motion";

/**
 * Home Page
 *
 * Redesigned multi-section landing page for FOSS Club NIT Srinagar.
 * Sections: Hero → Stats → Domains → Events → About → Projects → Roadmaps
 *         → Testimonials → Community → FAQ → Final CTA
 */
export default function Home() {
  // Define staggered framer-motion container & item presets for clean, premium loading animations
  const { containerVariants, itemVariants } = getStaggeredMotionPresets({
    childStagger: 0.18, // Time delay between consecutive children entry
    childDelay: 0.2,    // Initial delay before start
    itemOffsetY: 28,    // Vertical offset shift
    itemDuration: 0.6,  // Transition duration
  });

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center font-sans selection:bg-[#08B74F]/30 selection:text-white relative overflow-hidden w-full max-w-[100vw]">
      {/* Background ambient lighting/gradient blur elements */}
      <BackgroundBlur />

      {/* ─── HERO SECTION ───────────────────────────────────────────── */}
      <motion.section
        className="flex flex-col items-center justify-center min-h-svh pt-28 pb-16 md:pt-32 md:pb-20 px-4 max-w-7xl z-10 w-full relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/20 bg-[#08B74F]/5 text-[#08B74F] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>The Premier FOSS Community at NIT Srinagar</span>
        </motion.div>

        {/* Event Countdown */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-lg mb-12 min-[945px]:absolute min-[945px]:top-36 min-[945px]:right-8 lg:right-16 xl:right-24 min-[945px]:max-w-[240px] min-[945px]:mb-0 z-20"
        >
          <NextEventCountdown />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-center tracking-tighter leading-none mb-6"
        >
          Build.
          <br />
          Contribute.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] via-emerald-400 to-[#08B74F] bg-[length:200%_auto] animate-gradient">
            Collaborate.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-lg md:text-xl text-center max-w-2xl mb-10 leading-relaxed"
        >
          Join the developers building open source at NIT Srinagar.
          Workshops, hackathons, real projects — all open, all free.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-14"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 bg-[#08B74F] hover:bg-[#08B74F]/90 text-black px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-[0_0_40px_rgba(8,183,79,0.3)] hover:shadow-[0_0_60px_rgba(8,183,79,0.5)] hover:-translate-y-0.5"
          >
            Join the Community
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/events"
            className="group inline-flex items-center justify-center gap-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:bg-zinc-800/80 hover:-translate-y-0.5"
          >
            Explore Events
          </Link>
        </motion.div>


        {/* Hero Terminal */}
        <motion.div variants={itemVariants} className="w-full mt-12">
          <HeroTerminal />
        </motion.div>
      </motion.section>

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── STATS SECTION ──────────────────────────────────────────── */}
      {/* Displays key metrics such as member count, events hosted, and projects built */}
      <StatsSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── DOMAINS SECTION ────────────────────────────────────────── */}
      {/* Showcases different focus areas like Web Dev, App Dev, Devops, and Open Source */}
      <DomainsSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── UPCOMING EVENTS SECTION ────────────────────────────────── */}
      {/* Dynamically queries and lists upcoming hackathons, workshops, and meetups */}
      <UpcomingEventsSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── ABOUT SECTION ──────────────────────────────────────────── */}
      {/* Provides detailed background context about the club's mission and core values */}
      <AboutSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── FEATURED PROJECTS ─────────────────────────────────────── */}
      {/* <FeaturedProjectsSection /> */}

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── LEARNING ROADMAPS SECTION ──────────────────────────────── */}
      {/* Offers curated learning guides and tracks for different technologies */}
      <RoadmapsSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
      {/* <TestimonialsSection /> */}

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── COMMUNITY SECTION ──────────────────────────────────────── */}
      {/* Invitation channels (Discord/WhatsApp links) to connect with other devs */}
      <CommunitySection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── FAQ SECTION ────────────────────────────────────────────── */}
      {/* Accordion list addressing common onboarding and participation queries */}
      <FAQSection />

      {/* Divider */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* ─── FINAL CTA SECTION ──────────────────────────────────────── */}
      {/* Large closing banner to drive sign-ups and registrations */}
      <FinalCTASection />
    </div>
  );
}
