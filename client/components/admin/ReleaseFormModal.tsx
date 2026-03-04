import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Link as LinkIcon, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventItem {
    id: string;
    title: string;
    date: string;
    registrationConfig?: any;
}

interface ReleaseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: EventItem[];
}

export default function ReleaseFormModal({ isOpen, onClose, events }: ReleaseFormModalProps) {
    const [selectedEventId, setSelectedEventId] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");

    // Filter events to only show upcoming ones that haven't been released yet
    const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date() && !e.registrationConfig);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEventId || !validUntil) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/api/registration/config", {
                eventId: selectedEventId,
                validUntil: new Date(validUntil).toISOString(),
            });

            const eventNameForUrl = upcomingEvents.find(e => e.id === selectedEventId)?.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const fullUrl = `${window.location.origin}/events/registration/${eventNameForUrl}?id=${selectedEventId}`;

            setGeneratedLink(fullUrl);
            toast.success("Registration form released successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to release form.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        toast.success("Link copied to clipboard!");
    };

    const handleClose = () => {
        if (generatedLink) {
            window.location.reload();
        }
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
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Release Form</h2>
                                <p className="text-xs text-zinc-400 mt-0.5">Activate event registration</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {!generatedLink ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">
                                        Upcoming Event <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedEventId}
                                        onChange={(e) => setSelectedEventId(e.target.value)}
                                        className="w-full flex rounded-lg bg-[#0d1a12] border border-[#1b3123] h-11 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>Select an event</option>
                                        {upcomingEvents.map((event) => (
                                            <option key={event.id} value={event.id} className="bg-zinc-900">
                                                {event.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">
                                        Validity of form <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        className="bg-[#111e16] border-[#1b3123] h-11 px-4 focus-visible:ring-[#08B74F] text-white text-sm [color-scheme:dark]"
                                        required
                                    />
                                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3 h-3" /> Form will auto-close after this date.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !selectedEventId || !validUntil}
                                        className="w-full h-11 rounded-xl bg-[#08B74F] text-black hover:bg-[#08B74F]/90 font-bold"
                                    >
                                        {isSubmitting ? "Releasing..." : "Release Form"}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[#08B74F]/20 flex items-center justify-center text-[#08B74F] mb-2">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Form Released!</h3>
                                <p className="text-sm text-zinc-400 px-4">
                                    The registration form is now public. Share this link with participants.
                                </p>

                                <div className="w-full mt-4 p-3 bg-black/40 border border-zinc-800 rounded-lg flex items-center gap-2">
                                    <div className="flex-1 truncate text-xs text-zinc-300 font-mono text-left">
                                        {generatedLink}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded transition-colors shrink-0"
                                    >
                                        Copy
                                    </button>
                                </div>

                                <Button
                                    onClick={handleClose}
                                    className="w-full mt-4 h-11 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-bold"
                                >
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
