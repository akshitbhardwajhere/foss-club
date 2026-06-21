"use client";

import { motion } from "framer-motion";
import { Zap, Eye, Heart } from "lucide-react";

const MANIFESTO = [
  '// club.json',
  '{',
  '  "mission": "Democratize tech education",',
  '  "values": ["Open Source", "Collaboration"],',
  '  "stack": ["Linux", "Git", "Open Standards"],',
  '  "motto": "Build. Contribute. Collaborate.",',
  '  "status": "always_learning"',
  '}',
];

const PILLARS = [
  {
    icon: Zap,
    title: "Mission",
    body: "To democratize technology education at NIT Srinagar by fostering a culture of open-source contribution, peer learning, and community-driven innovation.",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "A campus where every student — regardless of branch or background — has access to a thriving tech community, mentorship, and real-world project experience.",
  },
  {
    icon: Heart,
    title: "What You Gain",
    body: "A GitHub portfolio that speaks for itself. Industry connections. Confidence to contribute to projects used by millions. And a lifelong community of builders.",
  },
];

export default function AboutSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.p>

      <motion.h2
        className="text-4xl md:text-5xl font-black tracking-tight text-white text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Open Source is a{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">
          Mindset
        </span>
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left — pillars */}
        <div className="flex flex-col gap-8">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center mt-0.5">
                <Icon className="w-5 h-5 text-[#08B74F]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right — manifesto code block */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-zinc-800/70 bg-zinc-950/80 backdrop-blur-md shadow-[0_0_40px_rgba(8,183,79,0.06)]"
        >
          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 bg-zinc-900/60">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-[#08B74F]/80" />
            <span className="ml-3 text-xs text-zinc-500 font-mono">club.json</span>
          </div>

          {/* Content */}
          <div className="px-5 py-5 font-mono text-sm leading-7">
            {MANIFESTO.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
                className={
                  line.startsWith("//")
                    ? "text-zinc-600 italic"
                    : line.includes('"mission"') || line.includes('"values"') || line.includes('"stack"') || line.includes('"motto"') || line.includes('"status"')
                    ? "text-zinc-300"
                    : line === "{" || line === "}"
                    ? "text-zinc-500"
                    : "text-[#08B74F]"
                }
              >
                {line.replace(/"([^"]+)":/g, (_, k) => `"${k}":`)
                  .split(/(\"[^\"]+\")/g)
                  .map((part, j) =>
                    part.startsWith('"') && part.endsWith('"') ? (
                      <span key={j} className={line.includes(`"${part.slice(1,-1)}":`) ? "text-blue-400" : "text-amber-300"}>
                        {part}
                      </span>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
