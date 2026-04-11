"use client";

import Image from "next/image";
import { Loader2, Images, Trash2, Edit2, Check } from "lucide-react";
import type { GalleryImage } from "./types";

interface GalleryManageGridProps {
  galleryImages: GalleryImage[];
  loadingGallery: boolean;
  editingImageId: string | null;
  editDescription: string;
  isUpdating: boolean;
  onEditStart: (imageId: string, description: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditCancel: () => void;
  onUpdateImage: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

export default function GalleryManageGrid({
  galleryImages,
  loadingGallery,
  editingImageId,
  editDescription,
  isUpdating,
  onEditStart,
  onEditDescriptionChange,
  onEditCancel,
  onUpdateImage,
  onDeleteImage,
}: GalleryManageGridProps) {
  return (
    <div className="lg:col-span-7 xl:col-span-8">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-black text-white px-2 tracking-wide">
          Live Gallery Composition
        </h3>
        <div className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-sm">
          <span className="text-white">{galleryImages.length}</span> / 10 Active
        </div>
      </div>

      {loadingGallery ? (
        <div className="flex justify-center py-20 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#08B74F]" />
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
            <Images className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Blank Canvas</h3>
          <p className="text-zinc-500 max-w-md">
            The gallery for this event is currently empty. Upload your first
            highlight using the console on the left!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-3xl p-5 flex flex-col group hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-300 shadow-lg"
            >
              <div className="w-full h-48 bg-zinc-950 rounded-2xl overflow-hidden mb-5 relative shadow-inner">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => onDeleteImage(img.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-xl backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditStart(img.id, img.description)}
                  className="absolute top-3 right-16 w-10 h-10 bg-blue-500/90 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-xl backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100"
                  title="Edit description"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 px-2 overflow-hidden flex flex-col">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-2">
                  Description
                </h4>
                {editingImageId === img.id ? (
                  <div className="flex flex-col gap-2 flex-1">
                    <textarea
                      value={editDescription}
                      onChange={(e) => onEditDescriptionChange(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-950/50 border border-zinc-700 text-white rounded-xl p-2 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] text-sm resize-none transition-all"
                    />
                    <div className="flex items-center justify-end gap-2 mt-auto pt-2">
                      <button
                        onClick={onEditCancel}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onUpdateImage(img.id)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#08B74F] text-black hover:bg-[#09c958] disabled:opacity-50 flex items-center gap-1 transition-colors"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}{" "}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                    {img.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
