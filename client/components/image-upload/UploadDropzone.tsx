"use client";

import type { ChangeEvent, RefObject } from "react";
import { Image as ImageIcon } from "lucide-react";

interface UploadDropzoneProps {
  hasValue: boolean;
  onOpenPicker: () => void;
  onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function UploadDropzone({
  hasValue,
  onOpenPicker,
  onSelectFile,
  fileInputRef,
}: UploadDropzoneProps) {
  return (
    <div
      onClick={onOpenPicker}
      className="w-full h-48 border-2 border-dashed border-zinc-700/50 hover:border-[#08B74F]/50 rounded-xl flex flex-col items-center justify-center bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors cursor-pointer text-zinc-400 group relative"
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onSelectFile}
      />
      <div className="flex gap-2 text-zinc-500">
        <ImageIcon className="w-10 h-10 mb-2 group-hover:text-[#08B74F] transition-colors" />
      </div>
      <span className="font-medium text-sm">
        {hasValue ? "Replace image" : "Click to select an image"}
      </span>
    </div>
  );
}
