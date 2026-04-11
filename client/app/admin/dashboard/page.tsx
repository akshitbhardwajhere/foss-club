"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { logoutAdmin } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import SignOutDialog from "@/components/admin/dashboard/SignOutDialog";
import DashboardStatGrid from "@/components/admin/dashboard/DashboardStatGrid";
import type { AdminDashboardStats } from "@/components/admin/dashboard/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Successfully signed out.");
      // Add a small delay to ensure state is fully updated before redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  const [stats, setStats] = useState<AdminDashboardStats>({
    events: { total: 0, upcoming: 0, past: 0 },
    team: { total: 0 },
    blogs: { total: 0 },
    queries: { total: 0 },
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch stats if authenticated
      if (!isAuthenticated || authLoading) {
        return;
      }

      try {
        setStatsError(null);
        const res = await api.get("/api/admin/stats");
        setStats(res.data);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load stats";
        setStatsError(`Error loading stats: ${errorMsg}`);
        toast.error(errorMsg);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [isAuthenticated, authLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="bg-[#050B08] text-white min-h-full lg:h-full relative w-full lg:overflow-hidden font-sans selection:bg-[#08B74F]/30 selection:text-white flex flex-col">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#08B74F]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10 w-full flex flex-col flex-1 lg:min-h-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 flex items-center justify-center shadow-lg backdrop-blur-md">
              <LayoutDashboard className="w-7 h-7 text-[#08B74F]" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white mb-1">
                Command Center
              </h1>
              <p className="text-zinc-400 font-medium">
                Manage FOSS Club resources & community data.
              </p>
            </div>
          </div>

          <SignOutDialog onConfirm={handleLogout} />
        </div>

        {/* Error Alert */}
        {statsError && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-300">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300">
              {statsError}
            </AlertDescription>
          </Alert>
        )}

        <DashboardStatGrid
          loadingStats={loadingStats}
          stats={stats}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </div>
    </div>
  );
}
