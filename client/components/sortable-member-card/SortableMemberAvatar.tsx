"use client";

import Image from "next/image";
import { Users, GraduationCap } from "lucide-react";

interface SortableMemberAvatarProps {
  src?: string;
  alt: string;
  isDragging: boolean;
  accentRingClassName: string;
  fallback: "team" | "alumni";
}

export default function SortableMemberAvatar({
  src,
  alt,
  isDragging,
  accentRingClassName,
  fallback,
}: SortableMemberAvatarProps) {
  return (
    <div
      className={`w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-900 mb-4 overflow-hidden relative shadow-xl ring-1 ring-zinc-700/50 ${isDragging ? accentRingClassName : ""}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="250px"
          className="object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500"
        />
      ) : fallback === "team" ? (
        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800/50">
          <Users className="w-10 h-10" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800/50">
          <GraduationCap className="w-10 h-10" />
        </div>
      )}
    </div>
  );
}
