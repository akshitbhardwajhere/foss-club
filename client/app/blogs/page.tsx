'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import BackgroundBlur from '@/components/shared/BackgroundBlur';
import PageHeader from '@/components/shared/PageHeader';
import BlogCard from '@/components/cards/BlogCard';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
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
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#08B74F] border-t-transparent flex rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-zinc-400">No blog posts found. Check back later.</p>
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
