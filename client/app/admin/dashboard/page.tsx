'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/lib/store';
import { logoutAdmin } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';
import {
    Users,
    Calendar,
    BookOpen,
    LogOut,
    LayoutDashboard,
} from 'lucide-react';
import api from '@/lib/axios';
import AdminStatCard from '@/components/admin/AdminStatCard';
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
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminDashboardPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await dispatch(logoutAdmin()).unwrap();
            toast.success("Successfully signed out.");
            router.push('/admin');
        } catch (error) {
            toast.error("Failed to sign out.");
        }
    };

    const [stats, setStats] = useState({
        events: { total: 0, upcoming: 0, past: 0 },
        team: { total: 0 },
        blogs: { total: 0 }
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
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
                            <p className="text-zinc-400 font-medium">Manage FOSS Club resources & community data.</p>
                        </div>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-semibold hover:-translate-y-0.5"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white shadow-2xl rounded-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold">Sign Out</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    Are you sure you want to sign out of the command center? You will need to authenticate again.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800 hover:text-white rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold">
                                    Sign Out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Bento Grid */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 lg:min-h-0 lg:grid-rows-2 pb-8 lg:pb-0 lg:overflow-hidden auto-rows-[minmax(250px,auto)] lg:auto-rows-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Events Card */}
                    <AdminStatCard
                        title="Events"
                        description="Schedule and manage upcoming hackathons, workshops, and meetups."
                        icon={Calendar}
                        href="/admin/events"
                        colorTheme="blue"
                        colSpan="lg:col-span-2"
                        itemVariants={itemVariants}
                        stats={loadingStats ? [
                            { label: "Total", value: <Skeleton className="h-6 w-12 bg-zinc-800" />, valueColor: "text-blue-400" },
                            { label: "Past", value: <Skeleton className="h-6 w-12 bg-zinc-800" />, valueColor: "text-zinc-400" },
                            { label: "Upcoming", value: <Skeleton className="h-6 w-12 bg-zinc-800" />, valueColor: "text-[#08B74F]" }
                        ] : [
                            { label: "Total", value: stats.events.total, valueColor: "text-blue-400" },
                            { label: "Past", value: stats.events.past, valueColor: "text-zinc-400" },
                            { label: "Upcoming", value: stats.events.upcoming, valueColor: "text-[#08B74F]" }
                        ]}
                    />

                    {/* Team Card */}
                    <AdminStatCard
                        title="Team Members"
                        description="Manage core club members and roles."
                        icon={Users}
                        href="/admin/team"
                        colorTheme="green"
                        itemVariants={itemVariants}
                        stats={loadingStats ? [
                            { label: "Active", value: <Skeleton className="h-6 w-12 bg-zinc-800" />, valueColor: "text-[#08B74F]" }
                        ] : [
                            { label: "Active", value: stats.team.total, valueColor: "text-[#08B74F]" }
                        ]}
                    />

                    {/* Blogs Card */}
                    <AdminStatCard
                        title="Technical Blogs"
                        description="Review, edit, and publish student-authored tech articles and guides."
                        icon={BookOpen}
                        href="/admin/blogs"
                        colorTheme="orange"
                        colSpan="lg:col-span-2"
                        itemVariants={itemVariants}
                        stats={loadingStats ? [
                            { label: "Published", value: <Skeleton className="h-6 w-12 bg-zinc-800" />, valueColor: "text-orange-400" }
                        ] : [
                            { label: "Published", value: stats.blogs.total, valueColor: "text-orange-400" }
                        ]}
                    />

                </motion.div>
            </div>
        </div>
    );
}
