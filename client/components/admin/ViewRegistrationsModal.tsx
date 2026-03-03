import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EventItem {
    id: string;
    title: string;
    date: string;
    registrationConfig?: any;
}

interface ViewRegistrationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: EventItem[];
}

export default function ViewRegistrationsModal({ isOpen, onClose, events }: ViewRegistrationsModalProps) {
    const router = useRouter();
    const [selectedEventId, setSelectedEventId] = useState("");

    // Only show events that HAVE an active/created registration form
    const registrationEvents = events.filter((e) => !!e.registrationConfig);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEventId) return;
        router.push(`/admin/events/registrations/${selectedEventId}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">View Registrations</h2>
                                <p className="text-xs text-zinc-400 mt-0.5">Select an event dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {registrationEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto" />
                                <h3 className="text-lg font-bold text-white">No Forms Released Yet</h3>
                                <p className="text-sm text-zinc-400">
                                    Release a registration form for an event first before you can view its registrants.
                                </p>
                                <Button
                                    onClick={onClose}
                                    className="w-full mt-4 h-11 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-bold"
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">
                                        Select Event <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedEventId}
                                        onChange={(e) => setSelectedEventId(e.target.value)}
                                        className="w-full flex rounded-lg bg-[#0d1a12] border border-[#1b3123] h-11 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>Choose an event dashboard</option>
                                        {registrationEvents.filter(e => new Date(e.date) > new Date()).map((event) => (
                                            <option key={event.id} value={event.id} className="bg-zinc-900">
                                                {event.title}
                                            </option>
                                        ))}
                                        {registrationEvents.filter(e => new Date(e.date) <= new Date()).map((event) => (
                                            <option key={event.id} value={event.id} className="bg-zinc-900">
                                                {event.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={!selectedEventId}
                                        className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 hover:bg-purple-600/30 font-bold transition-colors"
                                    >
                                        Open Dashboard <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
