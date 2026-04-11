"use client";

import { useState, useEffect } from "react";
import { BookOpen, Edit3, Plus } from "lucide-react";
import api from "@/lib/axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import BlogFormSection from "@/components/admin/blogs/BlogFormSection";
import BlogsTableSection from "@/components/admin/blogs/BlogsTableSection";
import {
  blogFormSchema,
  type BlogFormValues,
} from "@/components/admin/blogs/formSchema";
import type { BlogItem } from "@/components/admin/blogs/types";
import { toast } from "sonner";

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: { title: "", author: "", content: "", imageUrl: "" },
  });

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/blogs");
      const sortedBlogs = [...res.data].sort(
        (firstBlog, secondBlog) =>
          new Date(firstBlog.createdAt).getTime() -
          new Date(secondBlog.createdAt).getTime(),
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      // Error handled silently
      toast.error("Failed to fetch blogs from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title?: string) => {
    try {
      await api.delete(`/api/blogs/${id}`);
      setBlogs(blogs.filter((item) => item.id !== id));
      toast.success(`Blog "${title}" removed successfully.`);
    } catch (error) {
      // Error handled silently
      toast.error("Failed to delete the blog post.");
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

  async function onSubmit(values: BlogFormValues) {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/api/blogs/${editingId}`, values);
        toast.success("Blog updated successfully.");
      } else {
        await api.post("/api/blogs", values);
        toast.success("New blog published successfully!");
      }
      await fetchBlogs();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: unknown) {
      const error = err as any;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to publish blog",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <AdminPageHeader
          icon={BookOpen}
          iconClassName="bg-orange-500/10 text-orange-400 border-orange-500/20"
          title="Manage Blogs"
          subtitle="View, edit, or publish student technical blogs"
        />
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
        <AdminFormWrapper
          title={editingId ? "Edit Blog Post" : "New Blog Details"}
          onCancel={cancelForm}
        >
          <BlogFormSection
            form={form}
            isSubmitting={isSubmitting}
            editingId={editingId}
            onSubmit={onSubmit}
          />
        </AdminFormWrapper>
      ) : (
        <BlogsTableSection
          blogs={blogs}
          loading={loading}
          onCreate={() => setIsCreating(true)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
