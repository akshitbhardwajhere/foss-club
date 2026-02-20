'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
    title: React.ReactNode;
    className?: string;
}

export default function PageHeader({ title, className = "text-center mb-12" }: PageHeaderProps) {
    return (
        <motion.h1
            className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400 tracking-tight ${className}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
        >
            {title}
        </motion.h1>
    );
}
