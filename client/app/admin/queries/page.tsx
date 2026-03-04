"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, CalendarDays, Edit3, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

// The columns fetched from Sheet1!A:G
// 0: Date, 1: Name, 2: Email, 3: Phone, 4: Institute, 5: Enrollment, 6: Expertise
interface QueryRow {
    date: string;
    name: string;
    email: string;
    phone: string;
    institute: string;
    enrollment: string;
    expertise: string;
    originalRowIndex: number; // to send back to the backend
}

export default function QueriesAdminPage() {
    const [queries, setQueries] = useState<QueryRow[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<{ name: string, email: string, phone: string, institute: string, enrollment: string, expertise: string }>({
        name: "", email: "", phone: "", institute: "", enrollment: "", expertise: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/sheet");
            const rows = res.data;
            if (Array.isArray(rows)) {
                // Map the array to our interface, skipping a header row if present, or just mapping
                const mapped: QueryRow[] = rows.map((col: string[], idx: number) => ({
                    date: col[0] || "",
                    name: col[1] || "",
                    email: col[2] || "",
                    phone: col[3] || "",
                    institute: col[4] || "",
                    enrollment: col[5] || "",
                    expertise: col[6] || "",
                    originalRowIndex: idx + 1, // Google Sheets 1-indexed (row 1 is first row). The API returns an array (0-indexed). 
                }));

                // Usually row 1 is headers: "Date", "Name", etc. So we might filter it out.
                const filtered = mapped.filter(r => r.date.toLowerCase() !== "date" && r.name && r.name.toLowerCase() !== "name");

                // Sort descending by date (assuming ISO format)
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setQueries(filtered);
            }
        } catch (error) {
            toast.error("Failed to load queries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleDelete = async (rowIndex: number, name: string) => {
        try {
            await api.delete(`/api/sheet/${rowIndex}`);
            toast.success(`Query from "${name}" deleted successfully.`);
            fetchQueries();
        } catch (error) {
            toast.error("An error occurred while deleting the query.");
        }
    };

    const handleEditClick = (query: QueryRow) => {
        setEditForm({
            name: query.name,
            email: query.email,
            phone: query.phone,
            institute: query.institute,
            enrollment: query.enrollment,
            expertise: query.expertise
        });
        setEditingIndex(query.originalRowIndex);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    const submitEdit = async () => {
        if (!editingIndex) return;
        setIsSubmitting(true);
        try {
            await api.put(`/api/sheet/${editingIndex}`, editForm);
            toast.success("Query updated successfully");
            setEditingIndex(null);
            fetchQueries();
        } catch (err) {
            toast.error("Failed to update query");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <AdminPageHeader
                    icon={MessageSquare}
                    iconClassName="bg-blue-500/10 text-blue-400 border-blue-500/20"
                    title="Contact Queries"
                    subtitle="View and manage messages from the contact form"
                />
                <button
                    onClick={fetchQueries}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <motion.div
                className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <AdminTableSkeleton columns={["Contact Info", "Details", "Date", "Actions"]} />
                    ) : queries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
                            <MessageSquare className="w-12 h-12 mb-4 text-zinc-600" />
                            <p className="text-lg font-medium">No contact queries found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Contact Info</th>
                                    <th className="px-6 py-4 font-medium">Details</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {queries.map((q) => {
                                    const isEditing = editingIndex === q.originalRowIndex;

                                    if (isEditing) {
                                        return (
                                            <tr key={`edit-${q.originalRowIndex}`} className="bg-zinc-800/50">
                                                <td className="px-6 py-4" colSpan={4}>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Name</label>
                                                            <input
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Email</label>
                                                            <input
                                                                value={editForm.email}
                                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                                                            <input
                                                                value={editForm.phone}
                                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Institute</label>
                                                            <input
                                                                value={editForm.institute}
                                                                onChange={(e) => setEditForm({ ...editForm, institute: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Enrollment No.</label>
                                                            <input
                                                                value={editForm.enrollment}
                                                                onChange={(e) => setEditForm({ ...editForm, enrollment: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="xl:col-span-2">
                                                            <label className="block text-xs text-zinc-400 mb-1">Expertise / Skills</label>
                                                            <input
                                                                value={editForm.expertise}
                                                                onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2 lg:col-span-3 xl:col-span-6 flex justify-end gap-2 mt-2">
                                                            <button onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Cancel</button>
                                                            <button onClick={submitEdit} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold text-sm">
                                                                {isSubmitting ? "Saving..." : "Save"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr
                                            key={q.originalRowIndex}
                                            className="hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-white text-sm md:text-base">
                                                        {q.name}
                                                    </p>
                                                    <a href={`mailto:${q.email}`} className="text-xs text-[#08B74F] hover:underline">
                                                        {q.email}
                                                    </a>
                                                    <p className="text-xs text-zinc-400 mt-1">{q.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs md:max-w-md">
                                                <div className="truncate text-sm text-zinc-300 mb-1">
                                                    <span className="font-medium text-zinc-500 mr-2">Institute:</span>
                                                    {q.institute}
                                                </div>
                                                <div className="truncate text-sm text-zinc-300 mb-1">
                                                    <span className="font-medium text-zinc-500 mr-2">Enrollment:</span>
                                                    {q.enrollment}
                                                </div>
                                                <div className="truncate text-sm text-zinc-400">
                                                    <span className="font-medium text-zinc-500 mr-2">Expertise:</span>
                                                    {q.expertise}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">
                                                {q.date ? formatDate(q.date) : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(q)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <ConfirmDeleteDialog
                                                        trigger={
                                                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        }
                                                        itemName={`Query from ${q.name}`}
                                                        onConfirm={() =>
                                                            handleDelete(q.originalRowIndex, q.name)
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
