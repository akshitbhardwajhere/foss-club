"use client";

import { FileText, Loader2, X } from "lucide-react";
import { getFilenameFromUrl } from "./helpers";

interface PdfFilePillProps {
  value: string;
  isRemoving: boolean;
  onRemove: (e: React.MouseEvent) => void;
}

export default function PdfFilePill({
  value,
  isRemoving,
  onRemove,
}: PdfFilePillProps) {
  return (
    <div className="flex items-center gap-3 bg-[#0d1a12] border border-[#1b3123] rounded-lg px-4 py-3">
      <FileText className="w-5 h-5 text-[#08B74F] shrink-0" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-zinc-300 hover:text-[#08B74F] transition-colors truncate flex-1 font-medium"
        title={getFilenameFromUrl(value)}
      >
        {getFilenameFromUrl(value)}
      </a>
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        className="ml-auto shrink-0 p-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        title="Remove PDF"
      >
        {isRemoving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
