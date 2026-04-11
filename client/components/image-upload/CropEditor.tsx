"use client";

import type { PointerEvent, RefObject, SyntheticEvent } from "react";
import { Crop as CropIcon, Loader2 } from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import Image from "next/image";

interface CropEditorProps {
  imgSrc: string;
  previewUrl: string;
  crop: Crop | undefined;
  dynamicAspect: number | undefined;
  completedCrop: PixelCrop | null;
  isUploading: boolean;
  imgRef: RefObject<HTMLImageElement | null>;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: PixelCrop) => void;
  onDragStart: (e: PointerEvent<HTMLDivElement> | Event) => void;
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
  onCancel: () => void;
  onUpload: () => void;
}

export default function CropEditor({
  imgSrc,
  previewUrl,
  crop,
  dynamicAspect,
  completedCrop,
  isUploading,
  imgRef,
  onCropChange,
  onCropComplete,
  onDragStart,
  onImageLoad,
  onCancel,
  onUpload,
}: CropEditorProps) {
  return (
    <div className="flex flex-col items-start gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950">
      <div className="w-full flex justify-center bg-black/50 rounded-lg overflow-hidden relative">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => onCropChange(percentCrop)}
          onComplete={(c) => onCropComplete(c)}
          onDragStart={onDragStart}
          aspect={dynamicAspect}
          className="max-h-100"
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

      <div className="rounded-xl overflow-hidden shadow-2xl relative w-full h-100">
        <Image
          src={previewUrl}
          alt="Crop preview"
          fill
          sizes="500px"
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-lg flex-1 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onUpload}
          disabled={!completedCrop || isUploading}
          className="px-4 py-2 bg-[#08B74F] hover:bg-[#079A42] text-white rounded-lg flex-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  );
}
