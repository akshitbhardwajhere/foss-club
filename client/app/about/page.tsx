'use client';

import { motion } from 'framer-motion';
import { Terminal, Target, Users, Rocket } from 'lucide-react';
import BackgroundBlur from '@/components/shared/BackgroundBlur';
import PageHeader from '@/components/shared/PageHeader';

/**
 * AboutPage Component
 * 
 * Displays the club's mission statement, core values, and general information.
 * Uses Framer Motion to stagger the entrance of the information cards.
 */
export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
    };

    return (
        <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
            {/* Dynamic Background Blurs */}
            <BackgroundBlur />

            <motion.div
                className="w-full max-w-4xl z-10 flex flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium">
                    <Terminal className="w-4 h-4" /> About Us
                </motion.div>

                <PageHeader title={
                    <>
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">FOSS NIT Srinagar</span>
                    </>
                } />

                <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-16 leading-relaxed">
                    The FOSS (Free and Open Source Software) Club at NIT Srinagar is a community-driven initiative dedicated to promoting open-source culture, collaborative learning, and innovative software development among students.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                    <motion.div variants={itemVariants} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-8 rounded-[2rem] hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-[#08B74F]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                        <p className="text-zinc-400">To cultivate a robust ecosystem where students can learn, contribute, and innovate through open-source software, preparing them for real-world engineering challenges.</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-8 rounded-[2rem] hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-[#08B74F]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community First</h3>
                        <p className="text-zinc-400">We believe that learning is a collaborative process. Our club provides a safe, inclusive space for students to share ideas, seek help, and build together.</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-8 rounded-[2rem] hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500 md:col-span-2">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center mb-6">
                                    <Rocket className="w-6 h-6 text-[#08B74F]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">What We Do</h3>
                                <p className="text-zinc-400">From hands-on workshops on Linux and Git to large-scale hackathons and collaborative projects, we provide students with practical experiences that go beyond the traditional curriculum. We bridge the gap between academic learning and industry requirements.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
