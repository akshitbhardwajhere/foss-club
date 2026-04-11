"use client";

import type { CSSProperties, ReactNode } from "react";

interface SortableCardFrameProps {
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  isDragging: boolean;
  accentClassName: string;
  children: ReactNode;
}

export default function SortableCardFrame({
  setNodeRef,
  style,
  isDragging,
  accentClassName,
  children,
}: SortableCardFrameProps) {
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-zinc-900/50 border ${isDragging ? accentClassName : "border-zinc-800"} rounded-3xl p-5 pt-12 pb-5 flex flex-col items-center text-center relative group transition-colors`}
    >
      {children}
    </div>
  );
}
