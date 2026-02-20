'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import api from '@/lib/axios';
import BackgroundBlur from '@/components/shared/BackgroundBlur';
import PageHeader from '@/components/shared/PageHeader';
import TeamMemberCard from '@/components/cards/TeamMemberCard';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    imageUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
}

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.get('/api/team');
                console.log(res.data);
                setTeamMembers(res.data);
            } catch (error) {
                console.error('Failed to load team members:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
            {/* Dynamic Background Blurs */}
            <BackgroundBlur />

            <motion.div
                className="w-full max-w-6xl z-10 flex flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium">
                    <Users className="w-4 h-4" /> Core Team
                </motion.div>

                <PageHeader title={
                    <>
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">Innovators</span>
                    </>
                } />

                <motion.p variants={itemVariants} className="text-zinc-400 text-lg max-w-2xl mb-16">
                    The passionate individuals driving the open-source culture at NIT Srinagar. We are developers, designers, and creators building the future together.
                </motion.p>

                {loading ? (
                    <div className="flex items-center justify-center p-20 text-zinc-500 font-medium">
                        Loading team members...
                    </div>
                ) : teamMembers.length === 0 ? (
                    <div className="flex items-center justify-center p-20 text-zinc-500 font-medium border border-zinc-800/50 rounded-2xl w-full bg-zinc-900/20">
                        No team members found. Check back later!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {teamMembers.map((member, i) => (
                            <TeamMemberCard key={member.id || i} member={member} itemVariants={itemVariants} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
