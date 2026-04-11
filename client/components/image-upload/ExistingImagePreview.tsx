"use client";

import type { MouseEvent } from "react";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ExistingImagePreviewProps {
  value: string;
  isRemoving: boolean;
  onRemove: (e: MouseEvent) => void;
}

export default function ExistingImagePreview({
  value,
  isRemoving,
  onRemove,
}: ExistingImagePreviewProps) {
  return (
    <div className="relative w-70 h-70 rounded-xl overflow-hidden mb-2 group border border-zinc-800">
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 disabled:opacity-50"
        title="Remove Image"
      >
        {isRemoving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </button>
      <div className="relative w-full h-full">
        <Image
          src={value}
          alt="Current upload"
          fill
          sizes="300px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
