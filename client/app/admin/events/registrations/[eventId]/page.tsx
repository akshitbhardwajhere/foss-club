"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Mail, Calendar, MapPin, Search, Download } from "lucide-react";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";

interface Registrant {
    id: string;
    name: string;
    email: string;
    institute: string;
    enrollmentNo: string | null;
    branch: string;
    isIndividual: boolean;
    teamName: string | null;
    teamMembers: string[];
    areaOfInterest: string;
    createdAt: string;
}

export default function RegistrationsDashboard() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId as string;

    const [loading, setLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState("");
    const [registrations, setRegistrations] = useState<Registrant[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await api.get(`/api/registration/list/${eventId}`);
                setEventTitle(res.data.eventTitle);
                setRegistrations(res.data.registrations);
            } catch (err) {
                console.error("Failed to fetch registrations", err);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) fetchRegistrations();
    }, [eventId]);

    // Format Data for CSV Download
    const downloadCSV = () => {
        if (registrations.length === 0) return;

        const headers = ["Name", "Email", "Institute", "Enrollment No", "Branch", "Participation", "Team Name", "Team Members", "Area of Interest", "Registered At"];

        const csvRows = registrations.map(r => [
            `"${r.name}"`,
            `"${r.email}"`,
            `"${r.institute}"`,
            `"${r.enrollmentNo || ""}"`,
            `"${r.branch}"`,
            `"${r.isIndividual ? "Individual" : "Team"}"`,
            `"${r.teamName || ""}"`,
            `"${r.teamMembers.join(", ") || ""}"`,
            `"${r.areaOfInterest}"`,
            `"${formatDate(r.createdAt)}"`
        ]);

        const csvData = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Registrations.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredRegs = registrations.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.institute.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050B08] p-4 md:p-8 pt-24 md:pt-32 w-full max-w-8xl mx-auto selection:bg-[#08B74F]/30 text-white">
            {/* Header controls */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-3">
                            <Users className="w-4 h-4 mr-2 inline" />
                            {registrations.length} Total Registrations
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            {eventTitle || "Loading Event..."}
                        </h1>
                        <p className="text-zinc-400 mt-1 max-w-2xl">
                            Real-time view of all registrants for this specific event instance. Use the export tool to generate spreadsheets.
                        </p>
                    </div>

                    <div className="flex w-full md:w-auto items-center gap-3 mt-4 md:mt-0">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search registrants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111e16] border border-[#1b3123] h-10 pl-9 pr-4 rounded-lg text-white text-sm focus:outline-none focus:border-[#08B74F]/50 focus:ring-1 focus:ring-[#08B74F]/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={downloadCSV}
                            disabled={registrations.length === 0}
                            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-zinc-700 whitespace-nowrap"
                        >
                            <Download className="w-4 h-4" /> CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-8 h-8 border-4 border-[#08B74F] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredRegs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-zinc-500">
                            <Users className="w-12 h-12 mb-4 text-zinc-600" />
                            <p className="text-lg font-medium text-zinc-400">No registrations found.</p>
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="mt-2 text-[#08B74F] text-sm hover:underline">
                                    Clear search parameters
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-left whitespace-nowrap text-sm">
                            <thead className="bg-[#111e16] border-b border-[#1b3123] text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Participant</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Contact</th>
                                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Academic Details</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/40">
                                {filteredRegs.map((r) => (
                                    <tr key={r.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{r.name}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5 md:hidden truncate max-w-[150px]">{r.email}</div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-1.5 text-zinc-300">
                                                <Mail className="w-3.5 h-3.5 text-zinc-500" /> {r.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="text-zinc-300 font-medium">{r.institute}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5 max-w-[200px] truncate">
                                                {r.branch} <br /> {r.enrollmentNo && `${r.enrollmentNo}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.isIndividual ? (
                                                <span className="inline-flex px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                                                    Individual
                                                </span>
                                            ) : (
                                                <div>
                                                    <span className="inline-flex px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium content-center">
                                                        Team: {r.teamName}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-zinc-500 text-xs font-mono">
                                            {formatDate(r.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
