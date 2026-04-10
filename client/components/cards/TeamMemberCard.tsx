'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { ensureUrl } from '@/lib/utils';
import Image from 'next/image';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    company?: string;
    imageUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
}

interface TeamMemberCardProps {
    member: TeamMember;
    itemVariants: any; // We receive inherited motion variants from the parent layout
}

export default function TeamMemberCard({ member, itemVariants }: TeamMemberCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col items-center group hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500 overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#08B74F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-44 h-44 rounded-full bg-zinc-800 p-2 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
                <Image
                    src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                    alt={member.name}
                    width={352}
                    height={352}
                    className="w-full h-full rounded-full object-cover bg-zinc-950"
                    style={{ imageRendering: 'auto' }}
                />
            </div>

            <h3 className="text-xl font-bold mb-1 relative z-10 text-center">{member.name}</h3>
            <p className={`text-[#08B74F] font-medium relative z-10 text-center ${member.company ? 'mb-1' : 'mb-6'}`}>{member.role}</p>
            {member.company && (
                <p className="text-zinc-400 text-sm mb-6 relative z-10 text-center">@ {member.company}</p>
            )}

            <div className="flex gap-4 relative z-10">
                {member.githubUrl && (
                    <a href={ensureUrl(member.githubUrl)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                )}
                {member.linkedinUrl && (
                    <a href={ensureUrl(member.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:bg-zinc-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                )}
                {member.twitterUrl && (
                    <a href={ensureUrl(member.twitterUrl)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-400 hover:text-sky-500 hover:bg-zinc-800 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.774H18.916L7.084 4.126H5.117L17.083 19.774Z" fill="currentColor" />
                        </svg>
                    </a>
                )}
            </div>
        </motion.div>
    );
}
