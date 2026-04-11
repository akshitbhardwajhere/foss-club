"use client";

import { motion } from "framer-motion";
import { BookOpen, Edit3 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import type { BlogItem } from "./types";

interface BlogsTableSectionProps {
  blogs: BlogItem[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (blog: BlogItem) => void;
  onDelete: (id: string, title?: string) => void;
}

export default function BlogsTableSection({
  blogs,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: BlogsTableSectionProps) {
  return (
    <motion.div
      className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="overflow-x-auto min-h-75">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-zinc-400">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
            <BookOpen className="w-12 h-12 mb-4 text-zinc-600" />
            <p className="text-lg font-medium">No blogs yet.</p>
            <button
              onClick={onCreate}
              className="mt-4 text-[#08B74F] hover:underline font-medium"
            >
              Publish a blog post
            </button>
          </div>
        ) : (
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">
                  Author
                </th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {blogs.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white max-w-[200px] md:max-w-md truncate">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm hidden sm:table-cell">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <ConfirmDeleteDialog
                        trigger={
                          <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                            >
                              <path
                                d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        }
                        itemName={item.title}
                        onConfirm={() => onDelete(item.id, item.title)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
