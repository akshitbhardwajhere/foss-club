"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import BlogCard from "@/components/cards/BlogCard";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <PageHeader title="Our Blog" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800"
              >
                <Skeleton className="h-[200px] w-full rounded-xl bg-zinc-800" />
                <div className="space-y-3">
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" />
                    <Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50">
                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                    <Skeleton className="h-4 w-20 bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-zinc-400">
            No blog posts found. Check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
