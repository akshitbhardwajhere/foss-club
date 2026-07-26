"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, FolderGit2, Video, Image as ImageIcon, Users } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  githubUrl?: string;
  mediaType: "image" | "video";
  previewUrl: string;
  developedBy: string;
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: "fallback-1",
    title: "FOSS Club Website",
    description: "The official FOSS Club NIT Srinagar website — built with Next.js, Tailwind CSS, and an Express backend. Fully open source.",
    url: "https://foss.nitsri.ac.in",
    githubUrl: "https://github.com/fossnitsrinagar/foss-club",
    mediaType: "image",
    previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    developedBy: "FOSS Web Team",
  },
  {
    id: "fallback-2",
    title: "CTF Security Toolkit",
    description: "A curated collection of scripts, tools, and write-ups for Capture The Flag competitions, maintained by the security team.",
    url: "https://github.com/fossnitsrinagar/ctf-toolkit",
    githubUrl: "https://github.com/fossnitsrinagar/ctf-toolkit",
    mediaType: "image",
    previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    developedBy: "Cybersecurity Wing",
  },
];

export default function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/projects");
        if (res.data && res.data.length > 0) {
          setProjects(res.data.slice(0, 4));
        } else {
          setProjects(FALLBACK_PROJECTS);
        }
      } catch (err) {
        setProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
          BUILT BY COMMUNITY
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Featured Projects
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Real tools, apps, and platforms built by FOSS Club members. Explore our open source contributions and live demos.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-[#08B74F]/50 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(8,183,79,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Media Thumbnail */}
              <div className="w-full md:w-48 h-40 md:h-auto rounded-xl overflow-hidden bg-black/60 shrink-0 relative border border-zinc-800/80">
                {project.mediaType === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-purple-950/30 text-purple-400">
                    <Video className="w-8 h-8" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.previewUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>

              {/* Text Body */}
              <div className="flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#08B74F] font-semibold mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.developedBy}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#08B74F] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08B74F] hover:underline"
                  >
                    View Demo <ExternalLink className="w-3 h-3" />
                  </a>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View All Projects CTA */}
      <div className="text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#08B74F]/50 text-white font-bold text-sm hover:bg-zinc-800/80 transition-all hover:scale-105 shadow-lg group"
        >
          <FolderGit2 className="w-4 h-4 text-[#08B74F]" /> View All Projects
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
