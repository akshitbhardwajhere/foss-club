'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { BookOpen, Tag, ArrowLeft, Clock } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
    imageUrl?: string;
    createdAt: string;
}

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (params.id) {
                    const res = await api.get(`/api/blogs/${params.id}`);
                    setBlog(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch blog", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [params.id]);

    if (loading) {
        return (
            <div className="bg-[#050B08] min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#08B74F] border-t-transparent flex rounded-full animate-spin" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-[#050B08] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="text-zinc-400 mb-4">Blog post not found.</p>
                <button onClick={() => router.push('/blogs')} className="text-[#08B74F] hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#08B74F]/10 blur-[180px] rounded-full pointer-events-none z-0" />

            <div className="max-w-4xl mx-auto w-full z-10">
                <button onClick={() => router.back()} className="text-zinc-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <motion.div
                    className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {blog.imageUrl ? (
                        <div className="relative w-full h-[300px] md:h-[450px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-[250px] bg-zinc-800/30 flex items-center justify-center relative">
                            <BookOpen className="w-20 h-20 text-zinc-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                        </div>
                    )}

                    <div className="p-8 md:p-12 relative -mt-32 flex flex-col items-center">
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {blog.tags?.map((tag, idx) => (
                                <span key={idx} className="flex items-center gap-1 text-xs font-bold text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/20 px-3 py-1.5 rounded-full shadow-sm shadow-[#08B74F]/5">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-md leading-tight tracking-tight text-center">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-zinc-400 border-b border-zinc-800/50 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-lg text-zinc-300">
                                    {blog.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold text-zinc-200">{blog.author}</span>
                                    <span className="text-xs uppercase tracking-wider">Author</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-zinc-800 hidden md:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold text-zinc-200">{`${new Date(blog.createdAt).getDate().toString().padStart(2, '0')}/${(new Date(blog.createdAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(blog.createdAt).getFullYear()}`}</span>
                                    <span className="text-xs uppercase tracking-wider">Published</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-4xl mx-auto text-zinc-300 text-left w-full">
                            <p className="whitespace-pre-wrap leading-loose text-lg text-zinc-300/90 font-light">
                                {blog.content}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
