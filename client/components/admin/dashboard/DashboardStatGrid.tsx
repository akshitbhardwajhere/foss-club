"use client";

import { motion } from "framer-motion";
import { Users, Calendar, BookOpen, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import type { AdminDashboardStats } from "./types";

interface DashboardStatGridProps {
  loadingStats: boolean;
  stats: AdminDashboardStats;
  containerVariants: {
    hidden: { opacity: number };
    visible: { opacity: number; transition: { staggerChildren: number } };
  };
  itemVariants: {
    hidden: { opacity: number; y: number };
    visible: {
      opacity: number;
      y: number;
      transition: { duration: number; ease: "easeOut" };
    };
  };
}

export default function DashboardStatGrid({
  loadingStats,
  stats,
  containerVariants,
  itemVariants,
}: DashboardStatGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 lg:min-h-0 lg:grid-rows-2 pb-8 lg:pb-0 lg:overflow-hidden auto-rows-[minmax(250px,auto)] lg:auto-rows-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AdminStatCard
        title="Events"
        description="Schedule and manage upcoming hackathons, workshops, and meetups."
        icon={Calendar}
        href="/admin/events"
        colorTheme="blue"
        colSpan="lg:col-span-2"
        itemVariants={itemVariants}
        stats={
          loadingStats
            ? [
                {
                  label: "Total",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-blue-400",
                },
                {
                  label: "Past",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-zinc-400",
                },
                {
                  label: "Upcoming",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-[#08B74F]",
                },
              ]
            : [
                {
                  label: "Total",
                  value: stats.events.total,
                  valueColor: "text-blue-400",
                },
                {
                  label: "Past",
                  value: stats.events.past,
                  valueColor: "text-zinc-400",
                },
                {
                  label: "Upcoming",
                  value: stats.events.upcoming,
                  valueColor: "text-[#08B74F]",
                },
              ]
        }
      />

      <AdminStatCard
        title="Team Members"
        description="Manage core club members and roles."
        icon={Users}
        href="/admin/team"
        colorTheme="green"
        itemVariants={itemVariants}
        stats={
          loadingStats
            ? [
                {
                  label: "Active",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-[#08B74F]",
                },
              ]
            : [
                {
                  label: "Active",
                  value: stats.team.total,
                  valueColor: "text-[#08B74F]",
                },
              ]
        }
      />

      <AdminStatCard
        title="Technical Blogs"
        description="Review, edit, and publish student-authored tech articles and guides."
        icon={BookOpen}
        href="/admin/blogs"
        colorTheme="orange"
        colSpan="lg:col-span-2"
        itemVariants={itemVariants}
        stats={
          loadingStats
            ? [
                {
                  label: "Published",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-orange-400",
                },
              ]
            : [
                {
                  label: "Published",
                  value: stats.blogs.total,
                  valueColor: "text-orange-400",
                },
              ]
        }
      />

      <AdminStatCard
        title="FOSS Community"
        description="Manage community queries and view submitted forms."
        icon={Terminal}
        href="/admin/queries"
        colorTheme="blue"
        itemVariants={itemVariants}
        stats={
          loadingStats
            ? [
                {
                  label: "Pending",
                  value: <Skeleton className="h-6 w-12 bg-zinc-800" />,
                  valueColor: "text-[#08B74F]",
                },
              ]
            : [
                {
                  label: "Total Apps",
                  value: stats.queries.total,
                  valueColor: "text-[#08B74F]",
                },
              ]
        }
      />
    </motion.div>
  );
}
