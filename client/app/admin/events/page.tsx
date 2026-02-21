'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Edit3, Plus, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ImageUpload from '@/components/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormWrapper from '@/components/admin/AdminFormWrapper';
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import { toast } from 'sonner';

interface EventItem {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    imageUrl?: string;
}

const EVENT_CATEGORIES = ['Workshop', 'TechTalk / Seminar', 'Hackathon'] as const;

const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    category: z.string().min(1, { message: "Category is required." }),
    date: z.string().min(1, { message: "Date is required." }),
    location: z.string().min(1, { message: "Location empty." }),
    description: z.string().min(10, { message: "Description needed." }),
    imageUrl: z.string().optional(),
})

const TABLE_COLUMNS = ['Event Details', 'Date', 'Status', 'Actions'];

export default function EventsAdminPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", category: "", date: "", location: "", description: "", imageUrl: "" },
    })

    const fetchEvents = async () => {
        try {
            const res = await api.get('/api/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleDelete = async (id: string, title?: string) => {
        try {
            await api.delete(`/api/events/${id}`);
            setEvents(events.filter(event => event.id !== id));
            toast.success(`Event "${title}" deleted successfully.`);
        } catch (error) {
            console.error('Failed to delete event:', error);
            toast.error("An error occurred while deleting the event.");
        }
    };

    const handleEdit = (event: EventItem) => {
        form.reset({
            title: event.title || "",
            category: event.category || "",
            date: event.date ? new Date(event.date).toISOString().slice(0, 16).replace('T', ', ') : "",
            location: event.location || "",
            description: event.description || "",
            imageUrl: event.imageUrl || "",
        });
        setEditingId(event.id);
        setIsCreating(true);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);
        try {
            if (editingId) {
                await api.put(`/api/events/${editingId}`, values);
                toast.success("Event updated successfully.");
            } else {
                await api.post('/api/events', values);
                toast.success("New event published!");
            }
            await fetchEvents();
            setIsCreating(false);
            setEditingId(null);
            form.reset();
        } catch (err: unknown) {
            const error = err as any;
            setError(error.response?.data?.message || error.message || 'An error occurred');
            toast.error(error.response?.data?.message || error.message || 'Failed to publish event');
        } finally {
            setIsSubmitting(false);
        }
    }

    const cancelForm = () => { setIsCreating(false); setEditingId(null); form.reset(); };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <AdminPageHeader
                    icon={CalendarDays}
                    iconClassName="bg-blue-500/10 text-blue-400 border-blue-500/20"
                    title="Manage Events"
                    subtitle="View, edit, or create new upcoming events"
                />
                {!isCreating && (
                    <button
                        onClick={() => { setIsCreating(true); setEditingId(null); form.reset({ title: "", category: "", date: "", location: "", description: "", imageUrl: "" }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Create Event
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            {isCreating ? (
                <AdminFormWrapper
                    title={editingId ? "Edit Event" : "New Event Details"}
                    onCancel={cancelForm}
                    error={error}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Event Title <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Introduction to Linux Systems" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="category" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Category <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <div className="relative group/select">
                                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5ZM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        <select
                                                            className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 pl-9 pr-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 focus:border-[#08B74F]/40 focus:shadow-[0_0_12px_-3px_rgba(8,183,79,0.3)] appearance-none cursor-pointer transition-all duration-200 hover:border-[#08B74F]/30 hover:bg-[#111e16] shadow-inner shadow-black/20"
                                                            {...field}
                                                        >
                                                            <option value="" disabled className="bg-zinc-900 text-zinc-500">Select a category</option>
                                                            {EVENT_CATEGORIES.map((cat) => (
                                                                <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
                                                            ))}
                                                        </select>
                                                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="date" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Date & Time <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm w-full block [color-scheme:dark]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-zinc-300">Location / Link <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="Room 201 or Zoom Link" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white pr-9 text-sm" {...field} />
                                                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between mb-1">
                                                <FormLabel className="text-xs font-medium text-zinc-300 block">Event Description <span className="text-red-500">*</span></FormLabel>
                                                <span className="text-[10px] text-zinc-500 font-medium">Min 10 characters</span>
                                            </div>
                                            <FormControl>
                                                <div className="w-full border border-[#1b3123] rounded-lg overflow-hidden bg-[#111e16] focus-within:border-[#08B74F]/50 focus-within:ring-1 focus-within:ring-[#08B74F]/50 transition-all">
                                                    <textarea
                                                        className="w-full h-128 bg-transparent p-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none font-mono"
                                                        placeholder="# Write your event details here...&#10;- Agenda&#10;- Requirements"
                                                        {...field}
                                                    ></textarea>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="space-y-4">
                                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">Cover Image</FormLabel>
                                            <FormControl>
                                                <ImageUpload value={field.value || ""} onChange={(url) => field.onChange(url)} />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-[10px] text-zinc-500 mt-1">16:9 ratio, max 2MB.</p>
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10">
                                    {isSubmitting ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Event" : "Publish Event")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </AdminFormWrapper>
            ) : (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <AdminTableSkeleton columns={TABLE_COLUMNS} />
                        ) : events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
                                <CalendarDays className="w-12 h-12 mb-4 text-zinc-600" />
                                <p className="text-lg font-medium">No events found.</p>
                                <button onClick={() => setIsCreating(true)} className="mt-4 text-[#08B74F] hover:underline font-medium">Create your first event</button>
                            </div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Event Details</th>
                                        <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                                        <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {events.map((event) => {
                                        const isPast = new Date(event.date) < new Date();
                                        return (
                                            <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {event.imageUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={event.imageUrl} alt={event.title} className="w-10 h-10 rounded bg-zinc-800 object-cover hidden sm:block" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center hidden sm:flex">
                                                                <CalendarDays className="w-4 h-4 text-zinc-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-white text-sm md:text-base truncate max-w-[150px] md:max-w-xs">{event.title}</p>
                                                            <p className="text-xs text-zinc-500 md:hidden">{formatDate(event.date)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">{formatDate(event.date)}</td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${!isPast
                                                        ? 'border-[#08B74F]/30 bg-[#08B74F]/10 text-[#08B74F]'
                                                        : 'border-red-700 bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {isPast ? 'Completed' : 'Upcoming'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(event)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <ConfirmDeleteDialog
                                                            trigger={
                                                                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                                </button>
                                                            }
                                                            itemName={event.title}
                                                            onConfirm={() => handleDelete(event.id, event.title)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
