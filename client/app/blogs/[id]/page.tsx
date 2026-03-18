"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { BookOpen, Tag, ArrowLeft, Clock, User, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { stripHtml } from "@/lib/utils";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50">
      <div
        className="h-full bg-gradient-to-r from-[#08B74F] via-[#0ED966] to-[#08B74F] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(8,183,79,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function estimateReadTime(content: string): number {
  const plainText = stripHtml(content);
  const words = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (params.id) {
          const res = await api.get(`/api/blogs/${params.id}`);
          setBlog(res.data);
        }
      } catch (err) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#050B08] text-white flex flex-col items-center relative w-full pt-32 pb-20 px-4 font-sans">
        <div className="max-w-4xl mx-auto w-full z-10 mt-12">
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl relative">
            <Skeleton className="w-full h-[300px] md:h-[450px] bg-zinc-800/60" />
            <div className="p-8 md:p-12 relative -mt-32 flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-2 mb-6 z-10">
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
                <Skeleton className="h-6 w-24 rounded-full bg-zinc-800" />
                <Skeleton className="h-6 w-16 rounded-full bg-zinc-800" />
              </div>
              <Skeleton className="h-12 w-3/4 mb-6 bg-zinc-800 z-10" />
              <div className="flex flex-wrap justify-center items-center gap-6 mb-12 border-b border-zinc-800/50 pb-6 w-full">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                    <Skeleton className="h-3 w-12 bg-zinc-800" />
                  </div>
                </div>
                <div className="h-8 w-px bg-zinc-800 hidden md:block"></div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                    <Skeleton className="h-3 w-16 bg-zinc-800" />
                  </div>
                </div>
              </div>
              <div className="w-full max-w-4xl space-y-4">
                <Skeleton className="h-5 w-full bg-zinc-800" />
                <Skeleton className="h-5 w-11/12 bg-zinc-800" />
                <Skeleton className="h-5 w-full bg-zinc-800" />
                <Skeleton className="h-5 w-4/5 bg-zinc-800" />
                <Skeleton className="h-5 w-full bg-zinc-800" />
                <Skeleton className="h-5 w-5/6 bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-[#050B08] min-h-screen flex flex-col items-center justify-center text-white">
        <BookOpen className="w-16 h-16 text-zinc-700 mb-4" />
        <p className="text-zinc-400 mb-4 text-lg">Blog post not found.</p>
        <button
          onClick={() => router.push("/blogs")}
          className="text-[#08B74F] hover:underline flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </button>
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);
  const publishDate = new Date(blog.createdAt);
  const formattedDate = publishDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#050B08] text-white flex flex-col items-center relative w-full pt-28 pb-24 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white overflow-hidden">
      <ReadingProgress />

      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#08B74F]/8 blur-[200px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#08B74F]/5 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto w-full z-10">
        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="text-zinc-500 hover:text-[#08B74F] mb-8 flex items-center gap-2 transition-all duration-300 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Blogs</span>
        </motion.button>

        <motion.article
          className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/40 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero image */}
          {blog.imageUrl ? (
            <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          ) : (
            <div className="w-full h-[200px] md:h-[280px] bg-gradient-to-br from-zinc-800/40 via-zinc-900/60 to-zinc-950 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-zinc-700 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-zinc-700 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-zinc-700 rounded-full" />
              </div>
              <BookOpen className="w-16 h-16 text-zinc-700 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] to-transparent" />
            </div>
          )}

          {/* Content area */}
          <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 flex flex-col items-center">
            {/* Tags */}
            {blog.tags?.length > 0 && (
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-5 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-white leading-[1.15] tracking-tight text-center z-10 max-w-3xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {blog.title}
            </motion.h1>

            {/* Meta row: Author + Date + Read time */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10 text-zinc-400 border-b border-zinc-800/40 pb-8 w-full z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#08B74F]/30 to-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center font-bold text-base text-[#08B74F]">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-zinc-200 text-sm">
                    {blog.author}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Author
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-800 hidden md:block" />

              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800/60 flex items-center justify-center text-zinc-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-zinc-200 text-sm">
                    {formattedDate}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Published
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-800 hidden md:block" />

              {/* Read time */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800/60 flex items-center justify-center text-zinc-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-zinc-200 text-sm">
                    {readTime} min
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Read time
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Blog content */}
            <motion.div
              className="blog-content max-w-3xl mx-auto text-left w-full pb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-800/40 px-6 md:px-12 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <User className="w-3.5 h-3.5" />
              <span>
                Written by{" "}
                <span className="text-zinc-300 font-medium">{blog.author}</span>
              </span>
            </div>
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-11 h-11 rounded-full bg-[#08B74F] text-black flex items-center justify-center shadow-lg shadow-[#08B74F]/20 hover:shadow-[#08B74F]/40 hover:scale-110 transition-all z-50"
        initial={false}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: showScrollTop ? "auto" : "none" }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
