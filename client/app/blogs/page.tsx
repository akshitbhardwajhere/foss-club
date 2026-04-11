"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { User, Calendar, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchInput from "@/components/shared/SearchInput";
import PaginationControls from "@/components/shared/PaginationControls";

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

/**
 * BlogsPage Component
 *
 * The main public-facing blog directory for the FOSS club.
 * Fetches all published blogs from the backend (`/api/blogs`) and displays them with a paginated, searchable interface.
 * Allows users to sort chronological posts natively in the client.
 */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [dateSort, setDateSort] = useState<"default" | "desc" | "asc">(
    "default",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateSort]);

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

  const normalizedSearch = deferredSearchQuery.trim().toLowerCase();

  const sortedFilteredBlogs = useMemo(() => {
    const filteredBlogs = blogs.filter((blog) => {
      if (!normalizedSearch) return true;

      return (
        blog.title.toLowerCase().includes(normalizedSearch) ||
        blog.author.toLowerCase().includes(normalizedSearch) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
      );
    });

    return filteredBlogs.sort((a, b) => {
      if (dateSort === "default") return 0;

      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [blogs, dateSort, normalizedSearch]);

  const totalPages = useMemo(
    () => Math.ceil(sortedFilteredBlogs.length / itemsPerPage),
    [sortedFilteredBlogs.length],
  );

  const paginatedBlogs = useMemo(
    () =>
      sortedFilteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [sortedFilteredBlogs, currentPage],
  );

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <PageHeader title="Our Blog" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <SearchInput
            className="w-full md:w-96"
            placeholder="Search by blog title/author"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Sort blogs"
                  className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full md:w-auto"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Sort By
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800 text-zinc-200"
              >
                <DropdownMenuRadioGroup
                  value={dateSort}
                  onValueChange={(value) =>
                    setDateSort(value as "default" | "asc" | "desc")
                  }
                >
                  <DropdownMenuRadioItem value="default">
                    Default Sort
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Date: Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">
                    Date: Oldest First
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-zinc-900/40 p-4 lg:p-6 rounded-2xl border border-zinc-800"
              >
                <Skeleton className="h-12 w-12 rounded bg-zinc-800 hidden md:block" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-1/3 bg-zinc-800" />
                  <Skeleton className="h-4 w-1/4 bg-zinc-800" />
                </div>
                <div className="w-32 hidden lg:block">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </div>
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </div>
                <div className="w-24">
                  <Skeleton className="h-8 w-full rounded-full bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedBlogs.length === 0 ? (
          <p className="text-zinc-400 text-center py-12">
            No blogs found matching your query.
          </p>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 bg-zinc-900 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-1">No.</div>
              <div className="col-span-4 lg:col-span-5">BLOG TITLE</div>
              <div className="col-span-3 lg:col-span-2">AUTHOR</div>
              <div className="col-span-2">PUBLISHED DATE</div>
              <div className="col-span-2 text-right">ACTION</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-800/50">
              {paginatedBlogs.map((blog, i) => (
                <div
                  key={blog.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 lg:px-8 py-5 items-center hover:bg-zinc-800/30 transition-colors group"
                >
                  <div className="hidden lg:block col-span-1 text-zinc-500 font-medium text-sm">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </div>
                  <div className="col-span-1 lg:col-span-5 flex items-start gap-5">
                    {blog.imageUrl && (
                      <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden shrink-0 relative hidden md:block border border-zinc-700/50">
                        <Image
                          src={blog.imageUrl}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/blogs/${blog.id}`} className="block">
                        <h3 className="font-bold text-white text-lg group-hover:text-[#08B74F] transition-colors truncate">
                          {blog.title}
                        </h3>
                      </Link>

                      {/* Mobile only details */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 lg:hidden">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <User className="w-3.5 h-3.5 text-[#08B74F]" />
                          <span className="truncate max-w-37.5">
                            {blog.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Calendar className="w-3.5 h-3.5 text-[#08B74F]" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="hidden lg:mt-2 lg:flex lg:flex-wrap lg:gap-2">
                          {blog.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:flex col-span-2 text-sm text-zinc-400 items-center gap-2">
                    <User className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </div>

                  <div className="hidden lg:flex col-span-2 text-sm items-center text-zinc-300 gap-2">
                    <Calendar className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span className="font-medium">
                      {new Date(blog.createdAt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}{" "}
                      {
                        [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ][new Date(blog.createdAt).getMonth()]
                      }{" "}
                      {new Date(blog.createdAt).getFullYear()}
                    </span>
                  </div>

                  <div className="col-span-1 lg:col-span-2 flex justify-start lg:justify-end mt-4 lg:mt-0">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="px-6 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all duration-300 w-full lg:w-auto text-center border bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-white hover:text-black hover:border-white shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                      READ MORE
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
