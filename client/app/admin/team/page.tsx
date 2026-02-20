'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Edit3, Plus, GripVertical } from 'lucide-react';
import api from '@/lib/axios';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableTeamCard } from '@/components/SortableTeamCard';

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

interface TeamMember {
    id: string;
    name: string;
    role: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    imageUrl?: string;
}

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.string().min(2, { message: "Role is required." }),
    email: z.string().email().optional().or(z.literal('')),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    imageUrl: z.string().optional(),
})

export default function TeamAdminPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            email: "",
            github: "",
            linkedin: "",
            twitter: "",
            imageUrl: "",
        },
    })

    const fetchTeam = async () => {
        try {
            const res = await api.get('/api/team');
            setTeam(res.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/team/${id}`);
            setTeam(team.filter(member => member.id !== id));
        } catch (error) {
            console.error('Failed to delete team member:', error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = team.findIndex((i) => i.id === active.id);
            const newIndex = team.findIndex((i) => i.id === over.id);

            const reorderedTeam = arrayMove(team, oldIndex, newIndex);
            setTeam(reorderedTeam);

            // Construct bulk update payload based on new positions
            const payload = reorderedTeam.map((member, idx) => ({
                id: member.id,
                order: idx
            }));

            try {
                await api.put('/api/team/reorder', { items: payload });
            } catch (error) {
                console.error("Failed to reorder in database:", error);
                // Revert on failure
                fetchTeam();
            }
        }
    };

    const handleEdit = (member: TeamMember) => {
        form.reset({
            name: member.name || "",
            role: member.role || "",
            email: member.email || "",
            github: member.githubUrl || "",
            linkedin: member.linkedinUrl || "",
            twitter: member.twitterUrl || "",
            imageUrl: member.imageUrl || "",
        });
        setEditingId(member.id);
        setIsCreating(true);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);
        try {
            // Map frontend fields to backend Prisma schema
            const payload = {
                name: values.name,
                role: values.role,
                email: values.email || `${values.name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 10000)}@fossclub.com`,
                githubUrl: values.github,
                linkedinUrl: values.linkedin,
                imageUrl: values.imageUrl
            };

            if (editingId) {
                await api.put(`/api/team/${editingId}`, payload);
            } else {
                await api.post('/api/team', payload);
            }

            await fetchTeam();
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
                    <div className="w-12 h-12 rounded-xl bg-[#08B74F]/10 flex items-center justify-center text-[#08B74F] border border-[#08B74F]/20">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Team</h1>
                        <p className="text-zinc-400">View, edit, or append new Core Team members</p>
                    </div>
                </div>

                {!isCreating && (
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            form.reset({ name: "", role: "", email: "", github: "", linkedin: "", twitter: "", imageUrl: "" });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Add Member
                    </button>
                )}
            </div>

            {isCreating ? (
                <motion.div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                        <h2 className="text-2xl font-bold">{editingId ? "Edit Member Profile" : "New Member Profile"}</h2>
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
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <FormLabel className="text-xs font-medium text-zinc-300 block">Full Name <span className="text-red-500">*</span></FormLabel>
                                                        <span className="text-[10px] text-zinc-500 font-medium">Min 2 chars</span>
                                                    </div>
                                                    <FormControl>
                                                        <Input placeholder="John Doe" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-zinc-300">Club Role <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Lead Developer" className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Social Links Grid */}
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
                                        <h3 className="text-xs font-bold text-zinc-300 border-b border-zinc-800 pb-2">Social Profiles</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="github"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="GitHub URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="linkedin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="LinkedIn URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="twitter"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Twitter / X URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">Profile Avatar</FormLabel>
                                                <FormControl>
                                                    <div className="transform scale-90 origin-top">
                                                        <ImageUpload
                                                            value={field.value || ""}
                                                            onChange={(url) => field.onChange(url)}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-[10px] text-zinc-500 mt-1">Square ratio works best.</p>
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
                                    {isSubmitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Member" : "Add Member")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </motion.div>
            ) : (
                <div className="w-full">
                    {loading ? (
                        <div className="flex items-center justify-center p-12 text-zinc-400 w-full">Loading team roster...</div>
                    ) : team.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-400 w-full">
                            <Users className="w-12 h-12 mb-4 text-zinc-600" />
                            <p className="text-lg font-medium">No team members yet.</p>
                            <button onClick={() => setIsCreating(true)} className="mt-4 text-[#08B74F] hover:underline font-medium">Add core team lead</button>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={team.map(m => m.id)}
                                strategy={rectSortingStrategy}
                            >
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {team.map((member) => (
                                        <SortableTeamCard
                                            key={member.id}
                                            member={member}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </motion.div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            )}
        </div>
    );
}
