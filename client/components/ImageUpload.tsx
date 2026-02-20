'use client';
import { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    onChange: (url: string) => void;
    value: string;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Cloudinary Error:", errorData);
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await res.json();
            onChange(data.secure_url);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(`Failed to upload image: ${error.message}. Please check your config/preset.`);
        } finally {
            setIsUploading(false);
        }
    };

    const onClick = () => {
        if (!isUploading) {
            inputRef.current?.click();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleUpload}
            />
            {value ? (
                <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Upload preview" className="object-cover w-full h-full" />
                </div>
            ) : null}
            <button
                type="button"
                disabled={isUploading}
                onClick={onClick}
                className="w-full h-32 border-2 border-dashed border-zinc-700/50 hover:border-[#08B74F]/50 rounded-xl flex flex-col items-center justify-center bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors text-zinc-400 group relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-[#08B74F]" />
                ) : (
                    <UploadCloud className="w-8 h-8 mb-2 group-hover:text-[#08B74F] transition-colors" />
                )}
                <span className="font-medium">
                    {isUploading ? 'Uploading to Cloudinary...' : 'Click to select an image'}
                </span>
            </button>
        </div>
    );
}
