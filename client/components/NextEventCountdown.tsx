'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

interface Event {
    id: string;
    title: string;
    date: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function NextEventCountdown() {
    const [event, setEvent] = useState<Event | null>(null);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const res = await api.get('/api/events/next');
                setEvent(res.data);
            } catch (error) {
                console.error("Failed to fetch next event", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNextEvent();
    }, []);

    useEffect(() => {
        if (!event) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(event.date) - +new Date();
            let timeLeft = null;

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            setTimeLeft(newTime);

            // If time ran out, we could optionally refresh the next event here
            if (!newTime) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [event]);

    if (loading || !event || !timeLeft) return null;

    const timeBlocks = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours.toString().padStart(2, '0') },
        { label: 'Mins', value: timeLeft.minutes.toString().padStart(2, '0') },
        { label: 'Secs', value: timeLeft.seconds.toString().padStart(2, '0') },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 xl:mb-0 w-full max-w-xl mx-auto xl:fixed xl:top-32 xl:right-8 xl:w-auto xl:max-w-sm z-40 pointer-events-auto"
        >
            <Link href={`/events/${event.id}`} className="block group">
                <div className="bg-zinc-900/60 backdrop-blur-xl xl:backdrop-blur-md border border-zinc-800/50 hover:border-[#08B74F]/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] xl:shadow-2xl group-hover:shadow-[0_0_40px_rgba(8,183,79,0.15)] group-hover:-translate-y-1">

                    <div className="flex flex-col xl:flex-col sm:flex-row items-center justify-between gap-4 xl:gap-5">

                        {/* Event Info */}
                        <div className="flex flex-col items-center sm:items-start xl:items-center flex-1 text-center sm:text-left xl:text-center w-full">
                            <div className="flex items-center gap-1.5 text-[#08B74F] font-semibold text-[10px] xl:text-xs mb-1.5 sm:mb-2 uppercase tracking-wider bg-[#08B74F]/10 px-2 py-1 rounded-full border border-[#08B74F]/20">
                                <CalendarClock className="w-3 xl:w-3.5 h-3 xl:h-3.5" />
                                <span>Upcoming Event</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2 line-clamp-2 md:line-clamp-2 group-hover:text-[#08B74F] transition-colors leading-tight">
                                {event.title}
                            </h3>
                            <span className="text-zinc-500 text-[11px] font-medium flex items-center gap-1 group-hover:text-zinc-400 transition-colors">
                                View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-zinc-800/50 sm:hidden md:block my-1 opacity-50" />

                        {/* Countdown Blocks */}
                        <div className="flex items-center justify-center gap-2 md:gap-2 shrink-0">
                            {timeBlocks.map((block, i) => (
                                <div key={block.label} className="flex flex-col items-center">
                                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 flex items-center justify-center mb-1 group-hover:border-[#08B74F]/30 transition-colors shadow-inner">
                                        <AnimatePresence mode="popLayout">
                                            <motion.span
                                                key={block.value}
                                                initial={{ y: 10, opacity: 0, scale: 0.8 }}
                                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                                exit={{ y: -10, opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="text-lg sm:text-xl md:text-xl font-black text-white tabular-nums tracking-tighter"
                                            >
                                                {block.value}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] md:text-[9px] font-semibold text-zinc-500 uppercase tracking-widest">{block.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
