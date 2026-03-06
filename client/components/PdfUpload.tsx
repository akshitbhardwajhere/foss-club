'use client';
import { FileText, UploadCloud, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface PdfUploadProps {
    onChange: (url: string) => void;
    value: string;
}

export default function PdfUpload({ onChange, value }: PdfUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /** Extract a human-readable filename from a Cloudinary raw URL */
    function getFilenameFromUrl(url: string): string {
        try {
            const decoded = decodeURIComponent(url);
            const parts = decoded.split('/');
            // The last segment may contain a version prefix like "v1234567890_filename.pdf"
            // We just want the last segment without that prefix
            const last = parts[parts.length - 1];
            // Strip Cloudinary version-prefixed segment if present
            const withoutVersion = last.replace(/^v\d+_/, '');
            return withoutVersion || 'document.pdf';
        } catch {
            return 'document.pdf';
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
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
            formData.append('file', file);

            // Upload through our backend — it calls Cloudinary SDK with access_mode=public
            // Direct-to-Cloudinary uploads for raw files return 401 (private by default)
            const res = await api.post('/api/upload/document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onChange(res.data.url);
            toast.success('PDF uploaded successfully.');
        } catch (error: any) {
            console.error('PDF upload error:', error);
            toast.error(
                error.response?.data?.message ||
                error.message ||
                'Failed to upload the PDF.'
            );
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!value) return;

        setIsRemoving(true);
        try {
            await api.delete('/api/upload/remove-document', {
                data: { documentUrl: value },
            });
            onChange('');
            toast.success('PDF removed.');
        } catch (error) {
            console.error('Failed to remove document from Cloudinary:', error);
            // Still clear locally so the form isn't stuck
            onChange('');
            toast.error('Could not remove file from storage, but it has been cleared from the form.');
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Uploaded file pill */}
            {value ? (
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
                        onClick={handleRemove}
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
            ) : null}

            {/* Upload trigger (hidden when a file is already selected) */}
            {!value && (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group
                        ${isUploading
                            ? 'border-[#08B74F]/40 bg-[#08B74F]/5 cursor-not-allowed'
                            : 'border-zinc-700/50 hover:border-[#08B74F]/50 bg-zinc-900/30 hover:bg-zinc-800/50'
                        }`}
                >
                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
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
            )}

            {/* Replace button — shown when a file is already set */}
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
                    {isUploading ? 'Uploading…' : 'Replace PDF'}
                </button>
            )}
        </div>
    );
}
