'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Edit3, Plus, MapPin } from 'lucide-react';
import api from '@/lib/axios';

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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import ImageUpload from '@/components/ImageUpload';

interface EventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string;
}

const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    date: z.string().min(1, { message: "Date is required." }),
    location: z.string().min(1, { message: "Location empty." }),
    description: z.string().min(10, { message: "Description needed." }),
    imageUrl: z.string().optional(),
})

export default function EventsAdminPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            date: "",
            location: "",
            description: "",
            imageUrl: "",
        },
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

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/events/${id}`);
            setEvents(events.filter(event => event.id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const handleEdit = (event: EventItem) => {
        form.reset({
            title: event.title || "",
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
            } else {
                await api.post('/api/events', values);
            }

            // Refresh events and close form
            await fetchEvents();
            setIsCreating(false);
            setEditingId(null);
            form.reset();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
                        <p className="text-zinc-400">View, edit, or create new upcoming events</p>
                    </div>
                </div>

                {!isCreating && (
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            form.reset({ title: "", date: "", location: "", description: "", imageUrl: "" });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Create Event
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            {isCreating ? (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                        <h2 className="text-2xl font-bold">{editingId ? "Edit Event" : "New Event Details"}</h2>
                        <button onClick={() => { setIsCreating(false); setEditingId(null); form.reset(); }} className="text-zinc-400 hover:text-white font-medium text-sm px-4 py-2 bg-zinc-800/50 rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-zinc-300">Event Title <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Introduction to Linux Systems" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />


                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-zinc-300">Date & Time <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm w-full block [color-scheme:dark]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
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
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
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
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">Cover Image</FormLabel>
                                                <FormControl>
                                                    <div className="transform scale-90 origin-top">
                                                        <ImageUpload
                                                            value={field.value || ""}
                                                            onChange={(url) => field.onChange(url)}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-[10px] text-zinc-500 mt-1">16:9 ratio, max 2MB.</p>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10"
                                >
                                    {isSubmitting ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Event" : "Publish Event")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </motion.div>
            ) : (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex items-center justify-center p-12 text-zinc-400">Loading events...</div>
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
                                        const status = isPast ? 'Completed' : 'Upcoming';
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
                                                            <p className="text-xs text-zinc-500 md:hidden">{`${new Date(event.date).getDate().toString().padStart(2, '0')}/${(new Date(event.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(event.date).getFullYear()}`}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">{`${new Date(event.date).getDate().toString().padStart(2, '0')}/${(new Date(event.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(event.date).getFullYear()}`}</td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${!isPast
                                                        ? 'border-[#08B74F]/30 bg-[#08B74F]/10 text-[#08B74F]'
                                                        : 'border-red-700 bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(event)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-zinc-400">
                                                                        This action cannot be undone. This will permanently delete the event &quot;{event.title}&quot;.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(event.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
