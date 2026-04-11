"use client";

import { Loader2, UploadCloud } from "lucide-react";

interface PdfUploadDropzoneProps {
  isUploading: boolean;
  onClick: () => void;
  onSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function PdfUploadDropzone({
  isUploading,
  onClick,
  onSelectFile,
  fileInputRef,
}: PdfUploadDropzoneProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group
        ${
          isUploading
            ? "border-[#08B74F]/40 bg-[#08B74F]/5 cursor-not-allowed"
            : "border-zinc-700/50 hover:border-[#08B74F]/50 bg-zinc-900/30 hover:bg-zinc-800/50"
        }
      `}
    >
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={onSelectFile}
        disabled={isUploading}
      />
      {isUploading ? (
        <>
          <Loader2 className="w-8 h-8 text-[#08B74F] animate-spin mb-2" />
          <span className="text-sm font-medium text-[#08B74F]">Uploading…</span>
        </>
      ) : (
        <>
          <div className="flex gap-2 text-zinc-500 mb-1">
            <UploadCloud className="w-8 h-8 group-hover:text-[#08B74F] transition-colors" />
          </div>
          <span className="font-medium text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
            Click to upload PDF
          </span>
          <span className="text-xs text-zinc-600 mt-1">Max 10 MB</span>
        </>
      )}
    </div>
  );
}
