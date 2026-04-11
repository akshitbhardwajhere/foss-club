"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, Plus } from "lucide-react";
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
import TeamMemberFormSection from "@/components/admin/team/TeamMemberFormSection";
import TeamMembersSection from "@/components/admin/team/TeamMembersSection";
import {
  teamFormSchema,
  type TeamFormValues,
} from "@/components/admin/team/formSchema";
import { toast } from "sonner";

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

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      github: "",
      linkedin: "",
      twitter: "",
      imageUrl: "",
    },
  });

  const fetchTeam = async () => {
    try {
      const res = await api.get("/api/team");
      setTeam(res.data);
    } catch (error) {
      // Error handled silently
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string, name?: string) => {
    try {
      await api.delete(`/api/team/${id}`);
      setTeam(team.filter((member) => member.id !== id));
      toast.success(`Team member ${name} deleted successfully`);
    } catch (error) {
      // Error handled silently
      toast.error("Failed to delete team member");
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
      const oldIndex = team.findIndex((i) => i.id === active.id);
      const newIndex = team.findIndex((i) => i.id === over.id);
      const reorderedTeam = arrayMove(team, oldIndex, newIndex);
      setTeam(reorderedTeam);

      const payload = reorderedTeam.map((member: TeamMember, idx: number) => ({
        id: member.id,
        order: idx,
      }));
      try {
        await api.put("/api/team/reorder", { items: payload });
        toast.success("Team order updated");
      } catch (error) {
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

  async function onSubmit(values: TeamFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        role: values.role,
        email:
          values.email ||
          `${values.name.replace(/\s+/g, "").toLowerCase()}${Math.floor(Math.random() * 10000)}@fossclub.com`,
        githubUrl: values.github,
        linkedinUrl: values.linkedin,
        imageUrl: values.imageUrl,
      };

      if (editingId) {
        await api.put(`/api/team/${editingId}`, payload);
        toast.success("Team member updated successfully.");
      } else {
        await api.post("/api/team", payload);
        toast.success("New team member added!");
      }

      await fetchTeam();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to save team member details",
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

  const sortableItems = useMemo(() => team.map((m) => m.id), [team]);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    form.reset({
      name: "",
      role: "",
      email: "",
      github: "",
      linkedin: "",
      twitter: "",
      imageUrl: "",
    });
  };

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
            onClick={startCreate}
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
          <TeamMemberFormSection
            form={form}
            isSubmitting={isSubmitting}
            editingId={editingId}
            onSubmit={onSubmit}
          />
        </AdminFormWrapper>
      ) : (
        <TeamMembersSection
          loading={loading}
          team={team}
          sensors={sensors}
          sortableItems={sortableItems}
          onDragEnd={handleDragEnd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateClick={startCreate}
        />
      )}
    </div>
  );
}
