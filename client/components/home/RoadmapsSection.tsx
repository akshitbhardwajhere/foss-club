"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const ROADMAPS = [
  {
    title: "Open Source",
    emoji: "🌐",
    color: "border-[#08B74F]/40 hover:border-[#08B74F]/60",
    badge: "bg-[#08B74F]/10 text-[#08B74F] border-[#08B74F]/20",
    cta: "/blogs",
    steps: [
      "Understand Git & GitHub basics",
      "Fork & clone a repository",
      "Read CONTRIBUTING.md & open issues",
      "Submit your first Pull Request",
      "Get it reviewed and merged 🎉",
    ],
  },
  {
    title: "Web Development",
    emoji: "💻",
    color: "border-blue-500/40 hover:border-blue-500/60",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cta: "/blogs",
    steps: [
      "HTML, CSS & JavaScript fundamentals",
      "React.js & component thinking",
      "Next.js (App Router) & TypeScript",
      "REST APIs & full-stack with Node.js",
      "Deploy to Vercel / VPS with CI/CD",
    ],
  },
  {
    title: "Cybersecurity",
    emoji: "🔐",
    color: "border-red-500/40 hover:border-red-500/60",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    cta: "/blogs",
    steps: [
      "Linux terminal & networking basics",
      "Web vulnerabilities (OWASP Top 10)",
      "CTF challenges (PicoCTF, HackTheBox)",
      "Burp Suite, Nmap, Metasploit",
      "Write & publish CTF write-ups",
    ],
  },
  {
    title: "AI / Machine Learning",
    emoji: "🧠",
    color: "border-purple-500/40 hover:border-purple-500/60",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cta: "/blogs",
    steps: [
      "Python & NumPy/Pandas basics",
      "Classical ML with scikit-learn",
      "Neural networks with PyTorch",
      "HuggingFace & fine-tuning LLMs",
      "Deploy a model with FastAPI + Docker",
    ],
  },
];

export default function RoadmapsSection() {
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
          Get Started
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Learning Roadmaps
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Beginner-friendly paths curated by our core team. Pick a domain and start your journey today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ROADMAPS.map((roadmap, i) => (
          <motion.div
            key={roadmap.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`group flex flex-col gap-5 p-6 rounded-2xl bg-zinc-900/40 border transition-all duration-300 hover:-translate-y-1 ${roadmap.color}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{roadmap.emoji}</span>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${roadmap.badge}`}>
                  Roadmap
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{roadmap.title}</h3>
              </div>
            </div>

            <ol className="flex flex-col gap-2.5">
              {roadmap.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-600 mt-0.5" />
                  {step}
                </li>
              ))}
            </ol>

            <Link
              href={roadmap.cta}
              className="mt-auto group/btn inline-flex items-center gap-2 text-sm font-semibold text-[#08B74F] hover:text-white transition-colors"
            >
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
