"use client";

import type { ReactNode } from "react";

interface SortableActionButtonProps {
  onClick: () => void;
  className: string;
  title: string;
  children: ReactNode;
}

export default function SortableActionButton({
  onClick,
  className,
  title,
  children,
}: SortableActionButtonProps) {
  return (
    <button onClick={onClick} className={className} title={title}>
      {children}
    </button>
  );
}
