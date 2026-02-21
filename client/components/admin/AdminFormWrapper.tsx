'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface AdminFormWrapperProps {
    title: string;
    onCancel: () => void;
    error?: string | null;
    children: ReactNode;
}

export default function AdminFormWrapper({
    title,
    onCancel,
    error,
    children,
}: AdminFormWrapperProps) {
    return (
        <motion.div
            className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button
                    onClick={onCancel}
                    className="text-zinc-400 hover:text-white font-medium text-sm px-4 py-2 bg-zinc-800/50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                    {error}
                </div>
            )}

            {children}
        </motion.div>
    );
}
