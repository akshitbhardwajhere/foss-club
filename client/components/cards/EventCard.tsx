'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
    id: string;
    title: string;
    description: string;
    category?: string;
    date: string;
    location: string;
    imageUrl?: string;
    registrationConfig?: any;
    isDateTentative?: boolean;
}

interface EventCardProps {
    event: Event;
    index: number;
    isPast: boolean;
}

export default function EventCard({ event, index, isPast }: EventCardProps) {
    const now = new Date();
    const eventDate = new Date(event.date);
    const isToday = now.toDateString() === eventDate.toDateString();
    const isActuallyPast = eventDate < now && !isToday;
    const isLive = isToday;

    const isRegistrationValid = event.registrationConfig && new Date(event.registrationConfig.validUntil) > new Date() && !isActuallyPast;
    const isRegistrationClosed = event.registrationConfig && new Date(event.registrationConfig.validUntil) <= new Date() && !isActuallyPast;

    return (
        <Link href={`/events/${event.id}`}>
            <motion.div
                className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-[#08B74F]/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(8,183,79,0.1)] transition-all duration-500 group h-full flex flex-col relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {event.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg bg-zinc-900/70 text-[#08B74F] border border-[#08B74F]/30">
                            {event.category}
                        </span>
                    )}
                    {isLive ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg bg-[#08B74F] text-black border border-[#08B74F]/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                            </span>
                            LIVE
                        </div>
                    ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${isActuallyPast ? 'bg-zinc-800/80 text-zinc-300 border border-zinc-700' : 'bg-[#08B74F] text-black border border-[#08B74F]/50'}`}>
                            {isActuallyPast ? 'Completed' : 'Upcoming'}
                        </span>
                    )}
                </div>

                {event.imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image src={event.imageUrl} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                    </div>
                ) : (
                    <div className="w-full h-48 bg-zinc-800/50 flex items-center justify-center relative">
                        <Calendar className="w-10 h-10 text-zinc-600" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                    </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-3 group-hover:text-[#08B74F] transition-colors">{event.title}</h2>
                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{event.description}</p>

                    <div className="mt-auto space-y-2">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-[#08B74F]" />
                            <span>
                                {event.isDateTentative 
                                    ? `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date(event.date).getMonth()]} ${new Date(event.date).getFullYear()}`
                                    : `${new Date(event.date).getDate().toString().padStart(2, '0')}/${(new Date(event.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(event.date).getFullYear()}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium border-t border-zinc-800/50 pt-2">
                            <MapPin className="w-4 h-4 text-[#08B74F]" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        {isRegistrationValid ? (
                            <div className="mt-4 flex">
                                <span className="text-xs font-bold px-4 py-2 bg-[#08B74F]/10 text-[#08B74F] border border-[#08B74F]/20 rounded-lg transition-colors w-full flex items-center justify-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#08B74F] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#08B74F]"></span>
                                    </span>
                                    Registrations are live
                                </span>
                            </div>
                        ) : isRegistrationClosed ? (
                            <div className="mt-4 flex">
                                <span className="text-xs font-bold px-4 py-2 bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 rounded-lg transition-colors w-full text-center">
                                    Registrations are closed
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
