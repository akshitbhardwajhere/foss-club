"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import PdfFilePill from "@/components/pdf-upload/PdfFilePill";
import PdfUploadDropzone from "@/components/pdf-upload/PdfUploadDropzone";
import { getFilenameFromUrl } from "@/components/pdf-upload/helpers";
import type { PdfUploadProps } from "@/components/pdf-upload/types";

/**
 * PdfUpload Component
 *
 * Specifically handles the uploading of `.pdf` documents via the backend's multer pipeline.
 * Unlike image uploads, PDFs must be uploaded server-side to guarantee `access_mode="public"` on Cloudinary.
 *
 * @param {PdfUploadProps} props - Component properties capturing the resulting URL.
 */
export default function PdfUpload({ onChange, value }: PdfUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`PDF must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload through our backend — it calls Cloudinary SDK with access_mode=public
      // Direct-to-Cloudinary uploads for raw files return 401 (private by default)
      const res = await api.post("/api/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onChange(res.data.url);
      toast.success("PDF uploaded successfully.");
    } catch (error: any) {
      console.error("PDF upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload the PDF.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    setIsRemoving(true);
    try {
      await api.delete("/api/upload/remove-document", {
        data: { documentUrl: value },
      });
      onChange("");
      toast.success("PDF removed.");
    } catch (error) {
      console.error("Failed to remove document from Cloudinary:", error);
      // Still clear locally so the form isn't stuck
      onChange("");
      toast.error(
        "Could not remove file from storage, but it has been cleared from the form.",
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <PdfFilePill
          value={value}
          isRemoving={isRemoving}
          onRemove={handleRemove}
        />
      ) : null}

      {!value && (
        <PdfUploadDropzone
          isUploading={isUploading}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onSelectFile={handleFileChange}
          fileInputRef={fileInputRef}
        />
      )}

      {value && (
        <button
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs text-zinc-500 hover:text-[#08B74F] transition-colors self-start disabled:opacity-50"
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? "Uploading…" : "Replace PDF"}
        </button>
      )}
    </div>
  );
}
