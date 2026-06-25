"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, BookOpen, PenLine } from "lucide-react";
import { motion } from "framer-motion";
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
import BlogCard from "@/components/cards/BlogCard";
import FeaturedBlogHero from "@/components/blogs/FeaturedBlogHero";
import BlogListingSkeleton from "@/components/blogs/BlogListingSkeleton";
import type { BlogListItem } from "@/components/blogs/types";
import { getStaggeredMotionPresets } from "@/lib/motion";

const GRID_ITEMS_PER_PAGE = 6;

/**
 * BlogsPage Component
 *
 * Public blog directory with a magazine-style card layout, featured hero,
 * search, date sorting, and pagination.
 */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [dateSort, setDateSort] = useState<"default" | "desc" | "asc">(
    "desc",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { containerVariants, itemVariants } = getStaggeredMotionPresets({
    childStagger: 0.08,
    itemOffsetY: 24,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateSort]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/api/blogs");
        setBlogs(res.data);
      } catch {
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

    return [...filteredBlogs].sort((a, b) => {
      if (dateSort === "default") return 0;

      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [blogs, dateSort, normalizedSearch]);

  const showFeatured =
    currentPage === 1 &&
    !normalizedSearch &&
    dateSort !== "asc" &&
    sortedFilteredBlogs.length > 0;

  const featuredBlog = showFeatured ? sortedFilteredBlogs[0] : null;
  const listForPagination = showFeatured
    ? sortedFilteredBlogs.slice(1)
    : sortedFilteredBlogs;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(listForPagination.length / GRID_ITEMS_PER_PAGE)),
    [listForPagination.length],
  );

  const paginatedBlogs = useMemo(
    () =>
      listForPagination.slice(
        (currentPage - 1) * GRID_ITEMS_PER_PAGE,
        currentPage * GRID_ITEMS_PER_PAGE,
      ),
    [listForPagination, currentPage],
  );

  const sortLabel =
    dateSort === "desc"
      ? "Newest First"
      : dateSort === "asc"
        ? "Oldest First"
        : "Default";

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <BackgroundBlur />

      <motion.div
        className="max-w-7xl mx-auto w-full z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium mx-auto w-fit"
        >
          <PenLine className="w-4 h-4" />
          Student Stories
        </motion.div>

        <PageHeader
          title={
            <>
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#08B74F] to-emerald-400">
                Blog
              </span>
            </>
          }
        />

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-center text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Technical articles, tutorials, and insights written by student
          developers at FOSS Club NIT Srinagar.
        </motion.p>

        {!loading && sortedFilteredBlogs.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm">
              <BookOpen className="w-4 h-4 text-[#08B74F]" />
              <span className="text-zinc-400">
                <span className="text-white font-semibold">
                  {sortedFilteredBlogs.length}
                </span>{" "}
                {sortedFilteredBlogs.length === 1 ? "article" : "articles"}
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10"
        >
          <SearchInput
            className="w-full md:max-w-md"
            placeholder="Search by title, author, or tag…"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Sort blogs"
                className="px-5 py-3 rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:text-white hover:border-[#08B74F]/40 hover:bg-zinc-800/80 transition-all flex items-center justify-center gap-2 text-sm font-medium w-full md:w-auto"
              >
                <ArrowUpDown className="w-4 h-4 text-[#08B74F]" />
                {sortLabel}
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
                <DropdownMenuRadioItem value="desc">
                  Date: Newest First
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">
                  Date: Oldest First
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="default">
                  Default Order
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {loading ? (
          <BlogListingSkeleton />
        ) : sortedFilteredBlogs.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 px-6 rounded-3xl border border-zinc-800/60 bg-zinc-900/30"
          >
            <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-300 text-lg font-medium mb-2">
              No articles found
            </p>
            <p className="text-zinc-500 text-sm">
              Try adjusting your search or sort filters.
            </p>
          </motion.div>
        ) : (
          <>
            {featuredBlog && <FeaturedBlogHero blog={featuredBlog} />}

            {paginatedBlogs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedBlogs.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </div>
            )}

            {showFeatured && paginatedBlogs.length === 0 && (
              <p className="text-zinc-500 text-center text-sm py-4">
                More articles coming soon.
              </p>
            )}

            {totalPages > 1 && (
              <div className="mt-10 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden">
                <PaginationControls
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
