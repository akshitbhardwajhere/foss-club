'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, GraduationCap, X } from 'lucide-react';
import { ensureUrl } from '@/lib/utils';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
    priority?: boolean;
}

export default function TeamMemberCard({ member, itemVariants, priority }: TeamMemberCardProps) {
    const isAlumni = !!member.company || member.role.toLowerCase().includes('alumni') || member.role.toLowerCase().includes('former');
    const colorTheme = isAlumni ? 'yellow-500' : '[#08B74F]';
    const bgTheme = isAlumni ? 'bg-yellow-500' : 'bg-[#08B74F]';
    const textTheme = isAlumni ? 'text-yellow-500' : 'text-[#08B74F]';
    const shadowTheme = isAlumni ? 'rgba(234,179,8,0.1)' : 'rgba(8,183,79,0.1)';

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full flex justify-center"
        >
            {/* Desktop Full Card View */}
            <div className={`hidden sm:flex w-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2rem] p-8 flex-col items-center group hover:border-${colorTheme}/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_${shadowTheme}] transition-all duration-500 overflow-hidden relative`}>
                <div className={`absolute inset-0 bg-gradient-to-b from-${colorTheme}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="w-44 h-44 rounded-full bg-zinc-800 p-2 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                        alt={member.name}
                        width={352}
                        height={352}
                        className="w-full h-full rounded-full object-cover bg-zinc-950"
                        style={{ imageRendering: 'auto' }}
                        priority={priority}
                    />
                </div>
                <h3 className="text-xl font-bold mb-1 relative z-10 text-center text-white">{member.name}</h3>
                <p className={`${textTheme} font-medium relative z-10 text-center ${member.company ? 'mb-1' : 'mb-6'} inline-flex items-center gap-1`}>
                    {isAlumni && <GraduationCap className="w-4 h-4" />} {member.role}
                </p>
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
            </div>

            {/* Mobile Dense Grid View + Clickable Modal Overlay */}
            <div className="flex sm:hidden w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex flex-col items-center gap-2 cursor-pointer w-full group">
                            <div className={`w-full aspect-square rounded-[24px] bg-zinc-800 p-[3px] relative group-hover:ring-2 ring-0 transition-all overflow-hidden ${isAlumni ? 'hover:ring-yellow-500' : 'hover:ring-[#08B74F]'}`}>
                                <Image
                                    src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                    alt={member.name}
                                    fill
                                    sizes="25vw"
                                    className="rounded-[20px] object-cover bg-zinc-950"
                                    style={{ imageRendering: 'auto' }}
                                    priority={priority}
                                />
                                {isAlumni && (
                                   <div className="absolute bottom-2 right-2 w-5 h-5 bg-yellow-500 rounded-full border border-black flex items-center justify-center z-20">
                                      <GraduationCap className="w-3 h-3 text-black" />
                                   </div>
                                )}
                            </div>
                            <p className="text-zinc-200 text-xs sm:text-sm font-semibold text-center truncate w-full group-hover:text-white transition-colors">{member.name.split(' ')[0]}</p>
                        </div>
                    </DialogTrigger>
                    
                    <DialogContent className={`sm:hidden bg-[#050B08] border border-zinc-800 text-white w-[92vw] max-w-[360px] rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-2xl shadow-black/80 [&>button]:hidden`}>
                        <DialogTitle className="sr-only">Detailed Profile of {member.name}</DialogTitle>
                        <DialogHeader className="hidden"><DialogTitle>{member.name}</DialogTitle></DialogHeader>
                        
                        <div className={`w-32 h-32 rounded-full bg-zinc-800 p-2 mb-4 relative z-10`}>
                            <Image
                                src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                alt={member.name}
                                width={256}
                                height={256}
                                className="w-full h-full rounded-full object-cover bg-zinc-950"
                            />
                        </div>

                        <h3 className="text-2xl font-bold mb-1 text-center">{member.name}</h3>
                        <p className={`${textTheme} font-medium text-center ${member.company ? 'mb-1' : 'mb-6'} inline-flex items-center gap-1`}>
                            {isAlumni && <GraduationCap className="w-4 h-4" />} {member.role}
                        </p>
                        {member.company && (
                            <p className="text-zinc-400 text-sm mb-6 text-center">@ {member.company}</p>
                        )}

                        <div className="flex gap-4 mb-4">
                            {member.githubUrl && (
                                <a href={ensureUrl(member.githubUrl)} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                                    <Github className="w-6 h-6" />
                                </a>
                            )}
                            {member.linkedinUrl && (
                                <a href={ensureUrl(member.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:bg-zinc-800 transition-colors">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            {member.twitterUrl && (
                                <a href={ensureUrl(member.twitterUrl)} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-sky-500 hover:bg-zinc-800 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.774H18.916L7.084 4.126H5.117L17.083 19.774Z" fill="currentColor" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );
}
