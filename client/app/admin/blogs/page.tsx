'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Plus } from 'lucide-react';
import api from '@/lib/axios';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import ImageUpload from '@/components/ImageUpload';

interface BlogItem {
    id: string;
    title: string;
    createdAt: string;
    author: string;
    content: string;
    imageUrl?: string;
}

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    author: z.string().min(2, { message: "Author needed." }),
    content: z.string().min(50, { message: "Blog content needed." }),
    imageUrl: z.string().optional(),
})

export default function BlogsAdminPage() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            content: "",
            imageUrl: "",
        },
    })

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/api/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/blogs/${id}`);
            setBlogs(blogs.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to delete blog:', error);
        }
    };

    const handleEdit = (blog: BlogItem) => {
        form.reset({
            title: blog.title || "",
            author: blog.author || "",
            content: blog.content || "",
            imageUrl: blog.imageUrl || "",
        });
        setEditingId(blog.id);
        setIsCreating(true);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);
        try {
            if (editingId) {
                await api.put(`/api/blogs/${editingId}`, values);
            } else {
                await api.post('/api/blogs', values);
            }

            await fetchBlogs();
            setIsCreating(false);
            setEditingId(null);
            form.reset();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
                        <p className="text-zinc-400">View, edit, or publish student technical blogs</p>
                    </div>
                </div>

                {!isCreating && (
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            form.reset({ title: "", author: "", content: "", imageUrl: "" });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Publish Blog
                    </button>
                )}
            </div>

            {isCreating ? (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                        <h2 className="text-2xl font-bold">{editingId ? "Edit Blog Post" : "New Blog Details"}</h2>
                        <button onClick={() => { setIsCreating(false); setEditingId(null); form.reset(); }} className="text-zinc-400 hover:text-white font-medium text-sm px-4 py-2 bg-zinc-800/50 rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Blog Title <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Master the Linux File System" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="author"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Author <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jane Doe" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between mb-1">
                                                    <FormLabel className="text-xs font-medium text-zinc-300 block">Blog Markdown Copy <span className="text-red-500">*</span></FormLabel>
                                                    <span className="text-[10px] text-zinc-500 font-medium">Min 50 characters</span>
                                                </div>
                                                <FormControl>
                                                    <div className="w-full border border-[#1b3123] rounded-lg overflow-hidden bg-[#111e16] focus-within:border-[#08B74F]/50 focus-within:ring-1 focus-within:ring-[#08B74F]/50 transition-all">
                                                        <textarea
                                                            className="w-full h-128 bg-transparent p-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none font-mono"
                                                            placeholder="# Write your blog post in Markdown format..."
                                                            {...field}
                                                        ></textarea>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">Cover Image</FormLabel>
                                                <FormControl>
                                                    <div className="transform scale-90 origin-top">
                                                        <ImageUpload
                                                            value={field.value || ""}
                                                            onChange={(url) => field.onChange(url)}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10"
                                >
                                    {isSubmitting ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Blog" : "Publish Blog")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </motion.div>
            ) : (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex items-center justify-center p-12 text-zinc-400">Loading blogs...</div>
                        ) : blogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
                                <BookOpen className="w-12 h-12 mb-4 text-zinc-600" />
                                <p className="text-lg font-medium">No blogs yet.</p>
                                <button onClick={() => setIsCreating(true)} className="mt-4 text-[#08B74F] hover:underline font-medium">Publish a blog post</button>
                            </div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Title</th>
                                        <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                                        <th className="px-6 py-4 font-medium hidden sm:table-cell">Author</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {blogs.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white max-w-[200px] md:max-w-md truncate">{item.title}</td>
                                            <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">{`${new Date(item.createdAt).getDate().toString().padStart(2, '0')}/${(new Date(item.createdAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(item.createdAt).getFullYear()}`}</td>
                                            <td className="px-6 py-4 text-zinc-400 text-sm hidden sm:table-cell">{item.author}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEdit(item)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-zinc-400">
                                                                    This action cannot be undone. This will permanently delete the post &quot;{item.title}&quot;.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
