'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code2, Terminal, Globe } from 'lucide-react';
import BackgroundBlur from '@/components/shared/BackgroundBlur';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center min-h-screen pt-16 px-4 w-full max-w-8xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#08B74F]/20 bg-[#08B74F]/5 text-[#08B74F] text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(8,183,79,0.1)] hover:bg-[#08B74F]/10 transition-colors cursor-default">
          <Globe className="w-4 h-4" /> The Premier FOSS Community at NIT Srinagar
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black text-center tracking-tighter leading-[1] mb-8 relative">
          Innovate.<br />
          Collaborate.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] via-emerald-400 to-[#08B74F] bg-[length:200%_auto] animate-gradient">
            Open Source.
          </span>
          {/* Subtle noise/texture overlay for premium feel */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none rounded-xl" />
        </motion.h1>

        <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-2xl text-center max-w-3xl mb-12 font-medium leading-relaxed">
          Join the Free and Open Source Software (FOSS) Club at NIT Srinagar. We build, share, and learn together. Elevate your development journey alongside passionate engineers.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link href="/events" className="group inline-flex items-center justify-center gap-3 bg-[#08B74F] hover:bg-[#08B74F]/90 text-[#050B08] px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(8,183,79,0.3)] hover:shadow-[0_0_60px_rgba(8,183,79,0.5)] hover:-translate-y-1">
            Explore Events <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/blogs" className="group inline-flex items-center justify-center gap-3 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:bg-zinc-800/80 hover:-translate-y-1">
            Read Our Blog
          </Link>
        </motion.div>
      </motion.section>

      {/* Feature Showcase Grid - Bento Box Style */}
      <motion.section
        className="w-full max-w-8xl px-4 py-24 z-10 border-t border-zinc-900/50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Why Join <span className="text-[#08B74F]">FOSS</span>?</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Discover the benefits of contributing to the open-source ecosystem while leveling up your personal skillset.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr]">
          {[
            {
              title: "Open Source Projects",
              desc: "Contribute to real-world, scalable projects and rapidly grow your GitHub portfolio with impactful commits.",
              icon: <Code2 className="w-8 h-8 text-[#08B74F]" />,
              colSpan: "lg:col-span-2 md:col-span-2"
            },
            {
              title: "Hackathons",
              desc: "Participate in elite coding competitions.",
              icon: <Globe className="w-8 h-8 text-[#08B74F]" />,
              colSpan: "col-span-1"
            },
            {
              title: "Technical Workshops",
              desc: "Attend hands-on masterclasses covering Linux, Git, Web Development, DevOps, and more. Learn directly from industry veterans and core team members.",
              icon: <Terminal className="w-8 h-8 text-[#08B74F]" />,
              colSpan: "col-span-1"
            },
            {
              title: "Networking",
              desc: "Connect with like-minded developers.",
              icon: <ArrowRight className="w-8 h-8 text-[#08B74F]" />,
              colSpan: "lg:col-span-2 md:col-span-1"
            },
          ].map((feature, i) => (
            <div key={i} className={`bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-10 rounded-[2rem] hover:border-[#08B74F]/40 transition-all duration-500 group flex flex-col justify-between hover:bg-zinc-900/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] ${feature.colSpan}`}>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#08B74F]/20 transition-all duration-300 shadow-[inset_0_0_20px_rgba(8,183,79,0.05)]">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-white text-zinc-100 transition-colors">{feature.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
