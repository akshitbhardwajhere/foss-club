"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FolderGit2,
  ExternalLink,
  Github,
  Search,
  Code2,
  Users,
  Video,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  githubUrl?: string;
  mediaType: "image" | "video";
  previewUrl: string;
  developedBy: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.developedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        filterType === "all" || project.mediaType === filterType;

      return matchesSearch && matchesType;
    });
  }, [projects, searchQuery, filterType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="min-h-screen bg-[#050B08] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      <BackgroundBlur />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/10 text-[#08B74F] text-xs font-bold tracking-widest uppercase mb-4 inline-block shadow-[0_0_15px_rgba(8,183,79,0.2)]">
            OPEN SOURCE SHOWCASE
          </span>
          <PageHeader title="FOSS Projects & Innovation" />
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            Explore cutting-edge projects, web tools, systems, and repositories crafted by developers and team members at FOSS Club NIT Srinagar.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects or contributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#1b3123] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#08B74F]/60 focus:ring-1 focus:ring-[#08B74F]/60 transition-all"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "all"
                  ? "bg-[#08B74F] text-black shadow-[0_0_15px_rgba(8,183,79,0.3)]"
                  : "bg-[#0a1410] border border-[#1b3123] text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilterType("image")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "image"
                  ? "bg-[#08B74F] text-black shadow-[0_0_15px_rgba(8,183,79,0.3)]"
                  : "bg-[#0a1410] border border-[#1b3123] text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Images
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "video"
                  ? "bg-[#08B74F] text-black shadow-[0_0_15px_rgba(8,183,79,0.3)]"
                  : "bg-[#0a1410] border border-[#1b3123] text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Videos
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 animate-pulse flex flex-col p-4"
              >
                <div className="h-48 rounded-2xl bg-zinc-800/50 mb-4" />
                <div className="h-6 w-3/4 bg-zinc-800/50 rounded mb-2" />
                <div className="h-4 w-1/2 bg-zinc-800/50 rounded mb-4" />
                <div className="h-16 w-full bg-zinc-800/30 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 p-8">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-zinc-600 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              {searchQuery
                ? `No projects match "${searchQuery}". Try searching with different keywords.`
                : "No open source projects have been published yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group bg-[#0a1410]/80 border border-zinc-800/80 hover:border-[#08B74F]/50 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-[0_10px_30px_rgba(8,183,79,0.15)] flex flex-col h-full"
              >
                {/* Media Preview Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/60 border-b border-zinc-800/60 group-hover:border-[#08B74F]/30 transition-colors">
                  {project.mediaType === "video" ? (
                    project.previewUrl.includes("youtube.com") ||
                    project.previewUrl.includes("youtu.be") ? (
                      <iframe
                        src={project.previewUrl
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "youtube.com/embed/")}
                        className="w-full h-full"
                        allowFullScreen
                        title={project.title}
                      />
                    ) : (
                      <video
                        src={project.previewUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster=""
                      />
                    )
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.previewUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Media Type Badge Overlay */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 text-zinc-300">
                    {project.mediaType === "video" ? (
                      <>
                        <Video className="w-3 h-3 text-purple-400" /> Video Demo
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3 text-[#08B74F]" /> Preview
                      </>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Developed By Author Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#08B74F]/20 flex items-center justify-center border border-[#08B74F]/30">
                        <Users className="w-3 h-3 text-[#08B74F]" />
                      </div>
                      <span className="text-xs font-semibold text-[#08B74F] truncate">
                        {project.developedBy}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-white group-hover:text-[#08B74F] transition-colors leading-snug tracking-tight mb-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    {project.description && (
                      <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Links Action Bar */}
                  <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-3 mt-auto">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold text-xs hover:bg-[#08B74F]/90 transition-all shadow-[0_0_15px_rgba(8,183,79,0.2)] hover:scale-[1.02]"
                    >
                      Visit Project <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
