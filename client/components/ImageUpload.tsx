'use client';
import { UploadCloud, X, Crop as CropIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { getCroppedImg } from '@/lib/cropImage';

interface ImageUploadProps {
    onChange: (url: string) => void;
    value: string;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [dynamicAspect, setDynamicAspect] = useState<number | undefined>(1);
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images.
            setCompletedCrop(null);
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 70, // Create a 70% width crop by default
                },
                1, // Aspect ratio 1:1 initially
                width,
                height
            ),
            width,
            height
        );
        setCrop(crop);
    }

    // Determine if user is dragging a corner or a side handle
    const handleDragStart = (e: React.PointerEvent<HTMLDivElement> | Event) => {
        const target = e.target as HTMLElement;
        // ReactCrop appends classes like "ReactCrop__drag-handle ord-nw"
        if (target.className && typeof target.className === 'string') {
            const isCorner = target.className.includes('ord-nw') ||
                target.className.includes('ord-ne') ||
                target.className.includes('ord-sw') ||
                target.className.includes('ord-se');

            const isSide = target.className.includes('ord-n ') ||
                target.className.includes('ord-s ') ||
                target.className.includes('ord-e ') ||
                target.className.includes('ord-w ') ||
                target.className.endsWith('ord-n') ||
                target.className.endsWith('ord-s') ||
                target.className.endsWith('ord-e') ||
                target.className.endsWith('ord-w');

            if (isCorner) {
                setDynamicAspect(1);
            } else if (isSide) {
                setDynamicAspect(undefined);
            } else {
                // Clicking inside the mask to move it
                setDynamicAspect(undefined);
            }
        }
    };

    const uploadToCloudinary = async () => {
        if (!completedCrop || !imgRef.current) return;

        setIsUploading(true);
        try {
            const blob = await getCroppedImg(imgRef.current, completedCrop);

            const formData = new FormData();
            formData.append('file', blob);

            const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

            if (!preset || !cloudName) {
                toast.error("Missing Cloudinary configuration variables in environment.");
                return;
            }

            formData.append('upload_preset', preset);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error?.message || 'Upload failed');
            }

            const data = await res.json();
            onChange(data.secure_url);
            setImgSrc('');
            toast.success("Image cropped and uploaded successfully.");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload the image to Cloudinary.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!value) return;

        setIsRemoving(true);
        try {
            // Target our new backend explicit drop route
            await api.delete('/api/upload/remove', {
                data: { imageUrl: value }
            });
            onChange("");
            toast.success("Image removed successfully.");
        } catch (error) {
            console.error("Failed to delete image from Cloudinary:", error);
            toast.error("Failed to remove the image.");
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">

            {/* 1. Show existing image if it exists and we're not currently cropping a new one */}
            {value && !imgSrc ? (
                <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden mb-2 group border border-zinc-800">
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 disabled:opacity-50"
                        title="Remove Image"
                    >
                        {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Current upload" className="object-cover w-full h-full" />
                </div>
            ) : null}

            {/* 2. Upload / Drop Area when not cropping */}
            {!imgSrc && (
                <div
                    onClick={() => fileInputRef.current?.click()}
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
                        {value ? 'Replace image' : 'Click to select an image'}
                    </span>
                </div>
            )}

            {/* 3. Crop Area when picking a file */}
            {imgSrc && (
                <div className="flex flex-col items-start gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950">
                    <div className="w-full flex justify-center bg-black/50 rounded-lg overflow-hidden relative">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            onDragStart={handleDragStart}
                            aspect={dynamicAspect}
                            className="max-h-[400px]"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                className="max-w-full m-auto"
                            />
                        </ReactCrop>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => { setImgSrc(''); setCrop(undefined); }}
                            className="px-4 py-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-lg flex-1 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={uploadToCloudinary}
                            disabled={!completedCrop || isUploading}
                            className="px-4 py-2 bg-[#08B74F] hover:bg-[#079A42] text-white rounded-lg flex-[2] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CropIcon className="w-4 h-4" />
                                    Crop & Upload
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

