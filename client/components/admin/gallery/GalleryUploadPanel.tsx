"use client";

import { Loader2, PlusCircle, Images } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface GalleryUploadPanelProps {
  imageCount: number;
  newImageUrl: string;
  newImageDesc: string;
  isSubmitting: boolean;
  onImageUrlChange: (value: string) => void;
  onImageDescChange: (value: string) => void;
  onAddImage: () => void;
}

export default function GalleryUploadPanel({
  imageCount,
  newImageUrl,
  newImageDesc,
  isSubmitting,
  onImageUrlChange,
  onImageDescChange,
  onAddImage,
}: GalleryUploadPanelProps) {
  return (
    <div className="lg:col-span-5 xl:col-span-4 h-fit sticky top-6">
      <div className="bg-linear-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#08B74F] to-transparent opacity-50" />

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <PlusCircle className="w-6 h-6 text-[#08B74F]" /> Add Showcase Image
        </h3>

        {imageCount >= 10 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center shadow-inner">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Images className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="text-red-400 font-bold text-lg mb-1">
              Gallery is Full
            </h4>
            <p className="text-red-500/80 text-sm">
              Maximum limit of 10 images reached.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="flex items-center justify-between text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                <span>Image File</span>
                <span className="text-[#08B74F] text-xs px-2 py-0.5 rounded bg-[#08B74F]/10">
                  Required
                </span>
              </label>
              <ImageUpload value={newImageUrl} onChange={onImageUrlChange} />
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                <span>Image Context</span>
                <span className="text-[#08B74F] text-xs px-2 py-0.5 rounded bg-[#08B74F]/10">
                  Required
                </span>
              </label>
              <textarea
                value={newImageDesc}
                onChange={(e) => onImageDescChange(e.target.value)}
                rows={4}
                placeholder="Add a captivating description to pair with this highlight..."
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-2xl p-4 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] transition-all resize-none shadow-inner"
              />
            </div>

            <button
              onClick={onAddImage}
              disabled={isSubmitting || !newImageUrl || !newImageDesc.trim()}
              className="w-full bg-linear-to-r from-[#08B74F] to-[#06933f] hover:from-[#09c958] hover:to-[#08B74F] text-black font-black py-4 rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_10px_30px_-10px_rgba(8,183,79,0.4)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Save to Gallery{" "}
                  <span className="text-xl leading-none">→</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
