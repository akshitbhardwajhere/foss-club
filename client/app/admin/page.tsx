"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Terminal, Lock } from "lucide-react";

export default function AdminHomePage() {
    return (
        <div className="min-h-screen bg-[#060d08] flex items-center justify-center relative overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(8,183,79,1) 1px, transparent 1px), linear-gradient(90deg, rgba(8,183,79,1) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Glow blobs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#08B74F]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center gap-8 px-10 py-14 rounded-3xl border border-[#08B74F]/15 bg-[#08120c]/80 backdrop-blur-2xl shadow-2xl max-w-lg w-full mx-4"
            >
                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex items-center gap-2 bg-[#08B74F]/10 border border-[#08B74F]/25 rounded-full px-4 py-1.5"
                >
                    <Terminal className="w-3.5 h-3.5 text-[#08B74F]" />
                    <span className="text-[#08B74F] text-xs font-mono tracking-widest uppercase">
                        FOSS Club
                    </span>
                </motion.div>

                {/* Shield icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 180, damping: 14 }}
                    className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-[#08B74F]/10 border border-[#08B74F]/20"
                >
                    <ShieldCheck className="w-12 h-12 text-[#08B74F]" />
                    {/* Ping ring */}
                    <span className="absolute inset-0 rounded-3xl border border-[#08B74F]/30 animate-ping opacity-30" />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center space-y-3"
                >
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Restricted access zone. Sign in to manage events, blogs, and team members.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full"
                >
                    <Link
                        href="/admin/login"
                        className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[#08B74F] hover:bg-[#06a344] text-black font-bold text-base transition-all duration-300 shadow-lg shadow-[#08B74F]/25 hover:shadow-[#08B74F]/45"
                    >
                        <Lock className="w-4 h-4" />
                        Login to Admin Dashboard
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Footer */}
                <p className="text-zinc-600 text-xs text-center">
                    Unauthorized access is strictly prohibited.
                </p>
            </motion.div>
        </div>
    );
}
