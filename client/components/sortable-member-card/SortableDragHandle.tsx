"use client";

import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

interface SortableDragHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  title: string;
}

export default function SortableDragHandle({
  attributes,
  listeners,
  title,
}: SortableDragHandleProps) {
  return (
    <div
      {...attributes}
      {...listeners}
      className="absolute top-4 left-4 w-8 h-8 rounded-full text-zinc-500 cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors touch-none"
      title={title}
    >
      <GripVertical className="w-4 h-4" />
    </div>
  );
}
