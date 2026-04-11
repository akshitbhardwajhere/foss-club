"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableTeamCard } from "@/components/SortableTeamCard";

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

interface TeamMembersSectionProps {
  loading: boolean;
  team: TeamMember[];
  sensors: any;
  sortableItems: string[];
  onDragEnd: (event: any) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string, name?: string) => void;
  onCreateClick: () => void;
}

export default function TeamMembersSection({
  loading,
  team,
  sensors,
  sortableItems,
  onDragEnd,
  onEdit,
  onDelete,
  onCreateClick,
}: TeamMembersSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center gap-4"
          >
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
    );
  }

  if (team.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-400 w-full">
        <Users className="w-12 h-12 mb-4 text-zinc-600" />
        <p className="text-lg font-medium">No team members yet.</p>
        <button
          onClick={onCreateClick}
          className="mt-4 text-[#08B74F] hover:underline font-medium"
        >
          Add core team lead
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {team.map((member) => (
            <SortableTeamCard
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
