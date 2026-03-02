import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

interface Event {
    id: string;
    title: string;
    date: string;
    registrationConfig?: any;
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [registrationLink, setRegistrationLink] = useState("");

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const res = await api.get('/api/events/next');
                if (res.data) {
                    setEvent(res.data);
                    try {
                        const configRes = await api.get(`/api/registration/config/${res.data.id}`);
                        if (configRes.data && new Date(configRes.data.validUntil) > new Date()) {
                            setIsRegistrationOpen(true);
                            const eventNameForUrl = res.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            setRegistrationLink(`/events/registration/${eventNameForUrl}?id=${res.data.id}`);
                        }
                    } catch (configErr) {
                        // Form not released or closed
                    }
                }
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
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{
                opacity: 1,
                x: 0,
                width: isCollapsed ? "48px" : "auto",
                height: isCollapsed ? "48px" : "auto",
            }}
            transition={{
                layout: { duration: 0.6, type: "spring", bounce: 0.3 },
                opacity: { duration: 0.4 },
                x: { delay: 0.5, duration: 0.6 }
            }}
            className={`mb-8 2xl:mb-0 w-full ${isCollapsed ? 'max-w-none' : 'max-w-xl'} mx-auto 2xl:fixed 2xl:top-32 2xl:right-8 2xl:w-auto 2xl:max-w-sm z-40 pointer-events-auto group/countdown`}
        >
            <div className="relative w-full h-full">
                {/* Toggle Button - Only visible on 2xl where fixed */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCollapsed(!isCollapsed);
                    }}
                    className="hidden 2xl:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full items-center justify-center text-zinc-400 hover:text-[#08B74F] hover:border-[#08B74F]/50 transition-colors z-50 cursor-pointer shadow-lg"
                >
                    {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                <div
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={`
                        bg-zinc-900/60 backdrop-blur-xl 2xl:backdrop-blur-md border border-zinc-800/50 hover:border-[#08B74F]/50 
                        transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] 2xl:shadow-2xl 
                        ${isCollapsed
                            ? 'rounded-full w-12 h-12 flex items-center justify-center p-0 cursor-pointer hover:bg-[#08B74F]/20'
                            : 'rounded-2xl p-4 sm:p-5 group-hover:shadow-[0_0_40px_rgba(8,183,79,0.15)] group-hover:-translate-y-1'
                        }
                    `}
                >
                    <AnimatePresence mode="wait">
                        {isCollapsed ? (
                            <motion.div
                                key="collapsed"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="text-[#08B74F]"
                            >
                                <CalendarClock className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center gap-4 md:gap-5 min-w-[280px]"
                            >
                                <Link href={`/events/${event.id}`} className="block group w-full">
                                    <div className="flex flex-col items-center text-center w-full">
                                        <div className="flex items-center justify-center gap-1.5 text-[#08B74F] font-semibold text-[10px] 2xl:text-xs mb-1.5 sm:mb-2 uppercase tracking-wider bg-[#08B74F]/10 px-3 py-1 rounded-full border border-[#08B74F]/20">
                                            <CalendarClock className="w-3 2xl:w-3.5 h-3 2xl:h-3.5" />
                                            <span>Upcoming Event</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#08B74F] transition-colors leading-tight">
                                            {event.title}
                                        </h3>
                                        <span className="text-zinc-500 text-[11px] font-medium flex items-center justify-center gap-1 group-hover:text-zinc-400 transition-colors">
                                            View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-zinc-800/50 my-1 opacity-50" />

                                    <div className="flex flex-col w-full items-center justify-center">
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

                                        {isRegistrationOpen && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.location.href = registrationLink;
                                                }}
                                                className="mt-5 w-full bg-[#08B74F] hover:bg-[#08B74F]/90 text-black py-2.5 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(8,183,79,0.3)] transition-all flex items-center justify-center gap-2 z-50 pointer-events-auto cursor-pointer"
                                            >
                                                Register Now
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
