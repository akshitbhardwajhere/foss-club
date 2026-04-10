"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus } from "lucide-react";
import api from "@/lib/axios";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableAlumniCard } from "@/components/SortableAlumniCard";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { toast } from "sonner";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company?: string;
  email?: string;
  imageUrl?: string;
}

const formSchema = z.object({
  teamMemberId: z.string().min(1, { message: "Please select a team member." }),
  role: z.string().min(1, { message: "Role is required." }),
  company: z.string().optional(),
});

export default function AlumniAdminPage() {
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamMemberId: "",
      role: "",
      company: "",
    },
  });

  const fetchData = async () => {
    try {
      const [alumniRes, teamRes] = await Promise.all([
        api.get("/api/alumni"),
        api.get("/api/team"),
      ]);
      setAlumni(alumniRes.data);
      setTeamMembers(teamRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (member: TeamMember) => {
    form.reset({
      teamMemberId: member.id,
      role: member.role || "",
      company: member.company || "",
    });
    setEditingId(member.id);
    setIsCreating(true);
  };

  const handleRemove = async (id: string, name?: string) => {
    try {
      await api.put(`/api/alumni/${id}/status`, {
        isAlumni: false,
        company: null,
        role: alumni.find(a => a.id === id)?.role || "",
      });
      toast.success(`${name || 'Member'} removed from Alumni`);
      fetchData();
    } catch (error) {
      toast.error("Failed to remove from Alumni");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = alumni.findIndex((i) => i.id === active.id);
      const newIndex = alumni.findIndex((i) => i.id === over.id);
      const reorderedAlumni = arrayMove(alumni, oldIndex, newIndex);
      setAlumni(reorderedAlumni);

      const payload = reorderedAlumni.map((member: TeamMember, idx: number) => ({
        id: member.id,
        order: idx,
      }));
      try {
        await api.put("/api/team/reorder", { items: payload });
        toast.success("Alumni order updated");
      } catch (error) {
        toast.error("Failed to save new team order");
        fetchData();
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await api.put(`/api/alumni/${values.teamMemberId}/status`, {
        isAlumni: true,
        company: values.company,
        role: values.role,
      });

      toast.success(editingId ? "Alumni updated successfully." : "Alumni added successfully.");
      await fetchData();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update alumni status");
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <AdminPageHeader
          icon={GraduationCap}
          iconClassName="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          title="Manage Alumni"
          subtitle="Mark existing team members as Alumni and manage their records"
        />
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              form.reset({
                teamMemberId: "",
                role: "",
                company: "",
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Add Alumni
          </button>
        )}
      </div>

      {isCreating ? (
        <AdminFormWrapper
          title={editingId ? "Edit Alumni details" : "Add Alumni"}
          onCancel={cancelForm}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="teamMemberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-zinc-300 block">
                        Team Member <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                          {...field}
                          disabled={!!editingId}
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-fill role if changing selection (only when adding new)
                            if (!editingId) {
                               const selectedId = e.target.value;
                               const selectedMember = teamMembers.find(t => t.id === selectedId);
                               if (selectedMember) {
                                  form.setValue("role", selectedMember.role);
                               }
                            }
                          }}
                        >
                          <option value="" disabled>Select a team member</option>
                          {editingId && alumni.find(a => a.id === editingId) && (
                            <option value={editingId}>{alumni.find(a => a.id === editingId)?.name}</option>
                          )}
                          {!editingId && teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
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
                      <FormLabel className="text-xs font-medium text-zinc-300 block">
                        Alumni Role <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Former Technical Lead"
                          className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-yellow-500 text-white text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-zinc-300 block">
                        Current Company (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Google, Amazon, Microsoft"
                          className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-yellow-500 text-white text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors font-bold text-sm w-full md:w-auto h-10"
                >
                  {isSubmitting ? "Saving..." : "Save Alumni"}
                </Button>
              </div>
            </form>
          </Form>
        </AdminFormWrapper>
      ) : (
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 w-full rounded-2xl bg-zinc-800" />
              ))}
            </div>
          ) : alumni.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-400 w-full">
              <GraduationCap className="w-12 h-12 mb-4 text-zinc-600" />
              <p className="text-lg font-medium">No alumni records yet.</p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 text-yellow-500 hover:underline font-medium"
              >
                Promote team member to Alumni
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={alumni.map((m) => m.id)}
                strategy={rectSortingStrategy}
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {alumni.map((member) => (
                    <SortableAlumniCard
                      key={member.id}
                      member={member}
                      onEdit={handleEdit}
                      onRemove={handleRemove}
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
