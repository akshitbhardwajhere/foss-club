'use client';

import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

interface StatBlock {
    value: number | string | ReactNode;
    label: string;
    valueColor?: string;
}

interface AdminStatCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    stats: StatBlock[];
    colorTheme: 'blue' | 'green' | 'orange';
    colSpan?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemVariants: any; // Passed from parent layout
}

export default function AdminStatCard({
    title,
    description,
    icon: Icon,
    href,
    stats,
    colorTheme,
    colSpan = '',
    itemVariants
}: AdminStatCardProps) {

    const themeMap = {
        'blue': {
            borderHover: 'hover:border-blue-500/30',
            bgGlow: 'bg-blue-500/10 group-hover:bg-blue-500/20',
            iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            btnHover: 'hover:bg-blue-500/20 hover:border-blue-500/30'
        },
        'green': {
            borderHover: 'hover:border-[#08B74F]/30',
            bgGlow: 'bg-[#08B74F]/10 group-hover:bg-[#08B74F]/20',
            iconBg: 'bg-[#08B74F]/10 border-[#08B74F]/20 text-[#08B74F]',
            btnHover: 'hover:bg-[#08B74F]/20 hover:border-[#08B74F]/30'
        },
        'orange': {
            borderHover: 'hover:border-orange-500/30',
            bgGlow: 'bg-orange-500/10 group-hover:bg-orange-500/20',
            iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
            btnHover: 'hover:bg-orange-500/20 hover:border-orange-500/30'
        }
    };

    const theme = themeMap[colorTheme];

    return (
        <motion.div
            variants={itemVariants}
            className={`${colSpan} bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-6 md:p-8 relative overflow-hidden group ${theme.borderHover} transition-all duration-500 flex flex-col h-full`}
        >
            <div className={`absolute ${colSpan ? 'top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/3' : 'bottom-0 right-0 w-48 h-48 translate-y-1/3 translate-x-1/3'} ${theme.bgGlow} rounded-full blur-[60px] md:blur-[80px] transition-all duration-700`} />

            <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} border flex items-center justify-center`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <Link href={href} className={`w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white ${theme.btnHover} transition-all group-hover:scale-110`}>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className={colSpan ? '' : 'mt-auto'}>
                    <h3 className={`text-${colSpan ? '3xl' : '2xl'} font-bold mb-2 text-white`}>{title}</h3>
                    <p className="text-zinc-400 font-medium max-w-sm text-sm md:text-base">{description}</p>
                </div>

                <div className={`flex items-end gap-4 mt-4 flex-wrap`}>
                    {stats.map((stat, i) => (
                        <div key={i} className={colSpan ? "bg-zinc-950/50 rounded-xl px-3 md:px-4 py-2 border border-zinc-800/50 flex-1 min-w-[100px] md:min-w-0 md:flex-none" : "flex items-end gap-3"}>
                            <span className={`block ${colSpan ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-black ${stat.valueColor || 'text-white'}`}>{stat.value}</span>
                            <span className={`text-zinc-500 font-semibold uppercase tracking-wider ${colSpan ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm mb-1'} block md:inline`}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
