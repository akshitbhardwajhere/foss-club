'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormWrapper from '@/components/admin/AdminFormWrapper';
import { toast } from 'sonner';

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

const TEAM_ROLES = ['Team Lead', 'Co-Lead', 'Core Team Member', 'Graphic Designer', 'Content Writer', 'Volunteer'] as const;

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.string().min(1, { message: "Role is required." }),
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", role: "", email: "", github: "", linkedin: "", twitter: "", imageUrl: "" },
    })

    const fetchTeam = async () => {
        try {
            const res = await api.get('/api/team');
            setTeam(res.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeam(); }, []);

    const handleDelete = async (id: string, name?: string) => {
        try {
            await api.delete(`/api/team/${id}`);
            setTeam(team.filter(member => member.id !== id));
            toast.success(`Team member ${name} deleted successfully`);
        } catch (error) {
            console.error('Failed to delete team member:', error);
            toast.error("Failed to delete team member");
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = team.findIndex((i) => i.id === active.id);
            const newIndex = team.findIndex((i) => i.id === over.id);
            const reorderedTeam = arrayMove(team, oldIndex, newIndex);
            setTeam(reorderedTeam);

            const payload = reorderedTeam.map((member: TeamMember, idx: number) => ({ id: member.id, order: idx }));
            try {
                await api.put('/api/team/reorder', { items: payload });
                toast.success("Team order updated");
            } catch (error) {
                console.error("Failed to reorder in database:", error);
                toast.error("Failed to save new team order");
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
        try {
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
                toast.success("Team member updated successfully.");
            } else {
                await api.post('/api/team', payload);
                toast.success("New team member added!");
            }

            await fetchTeam();
            setIsCreating(false);
            setEditingId(null);
            form.reset();
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Failed to save team member details');
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
                    icon={Users}
                    iconClassName="bg-[#08B74F]/10 text-[#08B74F] border-[#08B74F]/20"
                    title="Manage Team"
                    subtitle="View, edit, or append new Core Team members"
                />
                {!isCreating && (
                    <button
                        onClick={() => { setIsCreating(true); setEditingId(null); form.reset({ name: "", role: "", email: "", github: "", linkedin: "", twitter: "", imageUrl: "" }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Add Member
                    </button>
                )}
            </div>

            {isCreating ? (
                <AdminFormWrapper
                    title={editingId ? "Edit Member Profile" : "New Member Profile"}
                    onCancel={cancelForm}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
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
                                        )} />

                                        <FormField control={form.control} name="role" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-zinc-300">Club Role <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <div className="relative group/select">
                                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" /></svg>
                                                        </div>
                                                        <select
                                                            className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 pl-9 pr-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 focus:border-[#08B74F]/40 focus:shadow-[0_0_12px_-3px_rgba(8,183,79,0.3)] appearance-none cursor-pointer transition-all duration-200 hover:border-[#08B74F]/30 hover:bg-[#111e16] shadow-inner shadow-black/20"
                                                            {...field}
                                                        >
                                                            <option value="" disabled className="bg-zinc-900 text-zinc-500">Select a role</option>
                                                            {TEAM_ROLES.map((role) => (
                                                                <option key={role} value={role} className="bg-zinc-900 text-white">{role}</option>
                                                            ))}
                                                        </select>
                                                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Social Links Grid */}
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
                                        <h3 className="text-xs font-bold text-zinc-300 border-b border-zinc-800 pb-2">Social Profiles</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <FormField control={form.control} name="github" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="GitHub URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="linkedin" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="LinkedIn URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="twitter" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Twitter / X URL" className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">Profile Avatar</FormLabel>
                                            <FormControl>
                                                <ImageUpload value={field.value || ""} onChange={(url) => field.onChange(url)} />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-[10px] text-zinc-500 mt-1">Square ratio works best.</p>
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10">
                                    {isSubmitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Member" : "Add Member")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </AdminFormWrapper>
            ) : (
                <div className="w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center gap-4">
                                    <Skeleton className="w-24 h-24 rounded-full bg-zinc-800" />
                                    <div className="space-y-2 w-full flex flex-col items-center">
                                        <Skeleton className="h-5 w-3/4 bg-zinc-800" />
                                        <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
                                        <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
                                        <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : team.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-400 w-full">
                            <Users className="w-12 h-12 mb-4 text-zinc-600" />
                            <p className="text-lg font-medium">No team members yet.</p>
                            <button onClick={() => setIsCreating(true)} className="mt-4 text-[#08B74F] hover:underline font-medium">Add core team lead</button>
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={team.map(m => m.id)} strategy={rectSortingStrategy}>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {team.map((member) => (
                                        <SortableTeamCard key={member.id} member={member} onEdit={handleEdit} onDelete={handleDelete} />
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
