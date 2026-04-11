"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableAlumniCard } from "@/components/SortableAlumniCard";
import type { TeamMember } from "./types";

interface AlumniGridSectionProps {
  loading: boolean;
  alumni: TeamMember[];
  sortableItems: string[];
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
  onCreate: () => void;
  onEdit: (member: TeamMember) => void;
  onRemove: (id: string, name?: string) => void;
}

export default function AlumniGridSection({
  loading,
  alumni,
  sortableItems,
  sensors,
  onDragEnd,
  onCreate,
  onEdit,
  onRemove,
}: AlumniGridSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (alumni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-400 w-full">
        <GraduationCap className="w-12 h-12 mb-4 text-zinc-600" />
        <p className="text-lg font-medium">No alumni records yet.</p>
        <button
          onClick={onCreate}
          className="mt-4 text-yellow-500 hover:underline font-medium"
        >
          Promote team member to Alumni
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
          {alumni.map((member) => (
            <SortableAlumniCard
              key={member.id}
              member={member}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
