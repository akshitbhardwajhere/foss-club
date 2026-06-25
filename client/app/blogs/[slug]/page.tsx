"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, ChevronUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReadingProgress from "@/components/blogs/detail/ReadingProgress";
import BlogDetailSkeleton from "@/components/blogs/detail/BlogDetailSkeleton";
import BlogAuthorSection from "@/components/blogs/detail/BlogAuthorSection";
import { extractIdFromSlug, slugify } from "@/lib/utils";
import {
  estimateReadTime,
  formatBlogDate,
} from "@/components/blogs/detail/helpers";
import type { BlogDetail } from "@/components/blogs/detail/types";

function MetaDot() {
  return (
    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
  );
}

/**
 * BlogDetailPage — premium editorial article layout.
 */
export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (params.slug) {
          const id = extractIdFromSlug(params.slug as string);
          if (id) {
            const res = await api.get(`/api/blogs/${id}`);
            setBlog(res.data);
            const correctSlug = `${slugify(res.data.title)}-${res.data.id}`;
            if (params.slug !== correctSlug) {
              router.replace(`/blogs/${correctSlug}`);
            }
          }
        }
      } catch {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.slug, router]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="bg-[#050B08] min-h-screen flex flex-col items-center justify-center text-white px-6">
        <div className="text-center max-w-sm">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-5" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold tracking-tight mb-2">
            Article not found
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            This post may have been removed or the link is no longer valid.
          </p>
          <button
            onClick={() => router.push("/blogs")}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#08B74F] hover:text-[#0ED966] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </button>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);
  const formattedDate = formatBlogDate(blog.createdAt);
  const primaryTag = blog.tags?.[0];

  return (
    <div className="bg-[#050B08] text-white min-h-screen selection:bg-[#08B74F]/30 selection:text-white">
      <ReadingProgress />

      {/* Ambient glow — restrained */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#08B74F]/[0.04] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Top navigation */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-6">
          <motion.button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            All articles
          </motion.button>
        </div>

        {/* Hero image — full bleed within container */}
        {blog.imageUrl && (
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[21/9] max-h-112 w-full overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
              <Image
                src={blog.imageUrl}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#050B08]/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Article header */}
        <motion.header
          className="max-w-3xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {primaryTag && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#08B74F] mb-5">
              {primaryTag}
            </p>
          )}

          <h1 className="text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] font-bold leading-[1.12] tracking-[-0.03em] text-white mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mb-10">
            <span className="text-zinc-300 font-medium">{blog.author}</span>
            <MetaDot />
            <time dateTime={blog.createdAt}>{formattedDate}</time>
            <MetaDot />
            <span>{readTime} min read</span>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        </motion.header>

        {/* Article body */}
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <BlogAuthorSection author={blog.author} tags={blog.tags} />
        </motion.div>

        {/* End CTA */}
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mt-4 pt-10 border-t border-zinc-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Discover more technical writing from FOSS Club members.
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#08B74F] hover:text-[#0ED966] transition-colors group shrink-0"
            >
              View all articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-[#08B74F] hover:border-[#08B74F]/30 flex items-center justify-center backdrop-blur-sm transition-all z-50"
        initial={false}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 8,
        }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: showScrollTop ? "auto" : "none" }}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-4 h-4" strokeWidth={2} />
      </motion.button>
    </div>
  );
}
