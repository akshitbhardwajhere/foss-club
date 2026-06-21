"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import type { GalleryImageItem } from "./types";

interface GalleryMasonryGridProps {
  images: GalleryImageItem[];
}

export default function GalleryMasonryGrid({ images }: GalleryMasonryGridProps) {
  const [lightbox, setLightbox] = useState<GalleryImageItem | null>(null);

  return (
    <>
      {/* Pinterest-style masonry — responsive CSS columns */}
      <div className="w-full columns-2 gap-x-3 sm:columns-3 sm:gap-x-4 lg:columns-4 xl:columns-5">
        {images.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid mb-4 group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 cursor-pointer shadow-lg hover:border-[#08B74F]/40 hover:shadow-[0_8px_32px_-8px_rgba(8,183,79,0.18)] transition-all duration-300"
            onClick={() => setLightbox(image)}
          >
            {/* Natural-height image — no fixed aspect ratio forced */}
            <div className="relative w-full">
              <Image
                src={image.url}
                alt={image.description || "Gallery photo"}
                width={800}
                height={600}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
                className="w-full h-auto block rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col items-center justify-center gap-3 p-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
              {image.description && (
                <p className="text-white text-sm text-center leading-snug font-medium line-clamp-3 px-2">
                  {image.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 bg-zinc-900/80 border border-zinc-700 rounded-full p-2 text-zinc-300 hover:text-white hover:border-white/40 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={lightbox.url}
                alt={lightbox.description || "Gallery photo"}
                width={1600}
                height={1200}
                sizes="100vw"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                priority
              />
            </div>

            {lightbox.description && (
              <p className="text-zinc-300 text-base text-center max-w-2xl leading-relaxed">
                {lightbox.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
