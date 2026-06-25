"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Sparkles, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { estimateReadTime, formatBlogDate } from "@/components/blogs/detail/helpers";
import { stripHtml } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

interface FeaturedBlogHeroProps {
  blog: Blog;
}

export default function FeaturedBlogHero({ blog }: FeaturedBlogHeroProps) {
  const readTime = estimateReadTime(blog.content);
  const excerpt = stripHtml(blog.content).slice(0, 220).trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mb-10"
    >
      <Link href={`/blogs/${blog.id}`} className="group block">
        <article className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm transition-all duration-500 hover:border-[#08B74F]/40 hover:shadow-[0_24px_60px_-20px_rgba(8,183,79,0.18)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#08B74F]/60 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {blog.imageUrl ? (
              <div className="relative h-56 sm:h-64 lg:h-80 overflow-hidden">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-zinc-950/80" />
              </div>
            ) : (
              <div className="relative h-56 sm:h-64 lg:h-80 bg-zinc-900/80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-[#08B74F]/30 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#08B74F]/20 rounded-full" />
                </div>
                <BookOpen className="w-16 h-16 text-zinc-700 relative z-10" />
              </div>
            )}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/25 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
                {blog.tags?.[0] && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {blog.tags[0]}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-[#08B74F] transition-colors duration-300">
                {blog.title}
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                {excerpt}
                {excerpt.length >= 220 ? "…" : ""}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#08B74F]" />
                  <span className="text-zinc-300 font-medium">{blog.author}</span>
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-700" />
                <span>{formatBlogDate(blog.createdAt)}</span>
                {/* <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-700" /> */}
                {/* <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#08B74F]" />
                  {readTime} min read
                </span> */}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#08B74F] group-hover:gap-3 transition-all duration-300">
                Read article
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
