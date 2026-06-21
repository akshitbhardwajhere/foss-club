"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

const PROJECTS = [
  {
    name: "FOSS Club Website",
    description: "The official FOSS Club NIT Srinagar website — built with Next.js, Tailwind CSS, and an Express backend. Fully open source.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Express", "PostgreSQL"],
    stars: 24,
    github: "https://github.com/fossnitsrinagar/foss-club",
    accent: "#08B74F",
  },
  {
    name: "CTF Toolkit",
    description: "A curated collection of scripts, tools, and write-ups for Capture The Flag competitions, maintained by the security team.",
    stack: ["Python", "Bash", "Cybersecurity"],
    stars: 18,
    github: "https://github.com/fossnitsrinagar/ctf-toolkit",
    accent: "#EF4444",
  },
  {
    name: "Open Source Roadmap",
    description: "A beginner-friendly, structured guide to making your first open-source contribution — from Git basics to merged PRs.",
    stack: ["Markdown", "Open Source", "Documentation"],
    stars: 41,
    github: "https://github.com/fossnitsrinagar/os-roadmap",
    accent: "#3B82F6",
  },
  {
    name: "Campus Dev Tools",
    description: "Browser extensions, scripts, and utilities built by students to make campus life easier — timetables, notifications, and more.",
    stack: ["JavaScript", "Chrome Extension", "Python"],
    stars: 33,
    github: "https://github.com/fossnitsrinagar/campus-tools",
    accent: "#8B5CF6",
  },
];

export default function FeaturedProjectsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4">
          Built by Students
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Featured Projects
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Real projects, real impact. Explore what our members have built and contribute to something meaningful.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${project.accent}40, transparent)` }}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-zinc-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-sm shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium">{project.stars}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed flex-1">
              {project.description}
            </p>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                View <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
