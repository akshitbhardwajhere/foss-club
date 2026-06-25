"use client";

import { ArrowUpRight, BookOpen, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { estimateReadTime } from "@/components/blogs/detail/helpers";
import type { BlogListItem } from "@/components/blogs/types";
import { stripHtml, slugify } from "@/lib/utils";
import CardShell from "@/components/cards/CardShell";

interface BlogCardProps {
  blog: BlogListItem;
  index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
  const readTime = estimateReadTime(blog.content);
  const excerpt = stripHtml(blog.content).slice(0, 140).trim();

  return (
    <Link href={`/blogs/${slugify(blog.title)}-${blog.id}`} className="block h-full">
      <CardShell index={index} className="cursor-pointer h-full flex flex-col">
        {blog.imageUrl ? (
          <div className="relative w-full h-44 overflow-hidden">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/70 border border-zinc-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-4 h-4 text-[#08B74F]" />
            </div>
          </div>
        ) : (
          <div className="w-full h-44 bg-zinc-900/80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#08B74F]/30 rounded-full" />
            </div>
            <BookOpen className="w-10 h-10 text-zinc-600 relative z-10" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 to-transparent" />
          </div>
        )}

        <div className="p-5 sm:p-6 flex flex-col grow">
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {blog.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/20 px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-[#08B74F] transition-colors line-clamp-2 leading-snug">
            {blog.title}
          </h2>

          <p className="text-zinc-400 text-sm mb-5 line-clamp-2 leading-relaxed grow">
            {excerpt}
            {excerpt.length >= 140 ? "…" : ""}
          </p>

          <div className="flex items-center justify-between text-xs mt-auto border-t border-zinc-800/50 pt-4 gap-3">
            <span className="inline-flex items-center gap-1.5 text-zinc-400 min-w-0">
              <User className="w-3.5 h-3.5 text-[#08B74F] shrink-0" />
              <span className="truncate text-zinc-300 font-medium">{blog.author}</span>
            </span>
            {/* <span className="inline-flex items-center gap-1.5 text-zinc-500 shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#08B74F]" />
              {readTime} min
            </span> */}
          </div>
        </div>
      </CardShell>
    </Link>
  );
}
