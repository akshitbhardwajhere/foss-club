"use client";

import { motion } from "framer-motion";
import {
  GitMerge, Globe, Brain, Shield, Trophy, Terminal,
} from "lucide-react";

const DOMAINS = [
  {
    icon: GitMerge,
    name: "Open Source",
    description: "Contribute to real-world projects, learn Git workflows, and build a GitHub portfolio that stands out to recruiters.",
    tags: ["Git", "GitHub", "PRs", "Open Source"],
    accent: "#08B74F",
    bg: "hover:border-[#08B74F]/40 hover:shadow-[0_0_30px_rgba(8,183,79,0.08)]",
    iconBg: "bg-[#08B74F]/10 border-[#08B74F]/20",
    iconColor: "text-[#08B74F]",
  },
  {
    icon: Globe,
    name: "Web Development",
    description: "From HTML fundamentals to full-stack Next.js apps. Build, deploy, and ship production-ready web projects.",
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
    accent: "#3B82F6",
    bg: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Brain,
    name: "AI / Machine Learning",
    description: "Explore the frontier of intelligent systems — from classical ML to LLMs and neural networks.",
    tags: ["Python", "PyTorch", "HuggingFace", "LLMs"],
    accent: "#8B5CF6",
    bg: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Shield,
    name: "Cybersecurity",
    description: "Participate in CTFs, learn ethical hacking, and develop the security mindset every developer needs.",
    tags: ["CTF", "Kali Linux", "Burp Suite", "OSINT"],
    accent: "#EF4444",
    bg: "hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]",
    iconBg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
  },
  {
    icon: Trophy,
    name: "Competitive Programming",
    description: "Sharpen your problem-solving skills with algorithm challenges, Codeforces rounds, and coding contests.",
    tags: ["C++", "Codeforces", "LeetCode", "Algorithms"],
    accent: "#F59E0B",
    bg: "hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Terminal,
    name: "Linux & DevOps",
    description: "Master the command line, containers, CI/CD pipelines, and cloud infrastructure like a pro.",
    tags: ["Linux", "Docker", "GitHub Actions", "AWS"],
    accent: "#06B6D4",
    bg: "hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
];

export default function DomainsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4">
          Interest Areas
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">
            Domain
          </span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Whether you&apos;re into hacking kernels or training neural networks — there&apos;s a community here for you.
        </p>
      </motion.div>

      {/* Domain cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DOMAINS.map((domain, i) => {
          const Icon = domain.icon;
          return (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 transition-all duration-300 cursor-default ${domain.bg} hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${domain.iconBg}`}>
                <Icon className={`w-6 h-6 ${domain.iconColor}`} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-white transition-colors">
                  {domain.name}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {domain.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {domain.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
