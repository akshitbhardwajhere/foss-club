"use client";

import { useState, useEffect, useMemo } from "react";
import { GraduationCap, Plus } from "lucide-react";
import api from "@/lib/axios";

import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import AlumniFormSection from "@/components/admin/alumni/AlumniFormSection";
import AlumniGridSection from "@/components/admin/alumni/AlumniGridSection";
import {
  alumniFormSchema,
  type AlumniFormValues,
} from "@/components/admin/alumni/formSchema";
import type { TeamMember } from "@/components/admin/alumni/types";
import { toast } from "sonner";

export default function AlumniAdminPage() {
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AlumniFormValues>({
    resolver: zodResolver(alumniFormSchema),
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
        role: alumni.find((a) => a.id === id)?.role || "",
      });
      toast.success(`${name || "Member"} removed from Alumni`);
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

      const payload = reorderedAlumni.map(
        (member: TeamMember, idx: number) => ({
          id: member.id,
          order: idx,
        }),
      );
      try {
        await api.put("/api/team/reorder", { items: payload });
        toast.success("Alumni order updated");
      } catch (error) {
        toast.error("Failed to save new team order");
        fetchData();
      }
    }
  };

  async function onSubmit(values: AlumniFormValues) {
    setIsSubmitting(true);
    try {
      await api.put(`/api/alumni/${values.teamMemberId}/status`, {
        isAlumni: true,
        company: values.company,
        role: values.role,
      });

      toast.success(
        editingId
          ? "Alumni updated successfully."
          : "Alumni added successfully.",
      );
      await fetchData();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update alumni status",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  const sortableItems = useMemo(() => alumni.map((m) => m.id), [alumni]);

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
          <AlumniFormSection
            form={form}
            isSubmitting={isSubmitting}
            editingId={editingId}
            teamMembers={teamMembers}
            alumni={alumni}
            onSubmit={onSubmit}
          />
        </AdminFormWrapper>
      ) : (
        <div className="w-full">
          <AlumniGridSection
            loading={loading}
            alumni={alumni}
            sortableItems={sortableItems}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onCreate={() => setIsCreating(true)}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
}
