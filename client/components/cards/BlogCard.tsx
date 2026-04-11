"use client";

import { BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { stripHtml } from "@/lib/utils";
import CardShell from "@/components/cards/CardShell";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

interface BlogCardProps {
  blog: Blog;
  index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <CardShell index={index} className="cursor-pointer h-full flex flex-col">
        {blog.imageUrl ? (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-48 bg-zinc-800/50 flex items-center justify-center relative">
            <BookOpen className="w-10 h-10 text-zinc-600" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 text-xs font-medium text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/20 px-2 py-1 rounded-full shadow-sm shadow-[#08B74F]/5"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-3 group-hover:text-[#08B74F] transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {stripHtml(blog.content)}
          </p>

          <div className="flex items-center justify-between text-zinc-500 text-xs mt-auto border-t border-zinc-800/50 pt-4 font-medium uppercase tracking-wider">
            <span className="text-zinc-300 shadow-sm">{blog.author}</span>
            <span>{`${new Date(blog.createdAt).getDate().toString().padStart(2, "0")}/${(new Date(blog.createdAt).getMonth() + 1).toString().padStart(2, "0")}/${new Date(blog.createdAt).getFullYear()}`}</span>
          </div>
        </div>
      </CardShell>
    </Link>
  );
}
