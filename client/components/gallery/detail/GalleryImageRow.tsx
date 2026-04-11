"use client";

import Image from "next/image";
import type { GalleryImageItem } from "./types";

interface GalleryImageRowProps {
  image: GalleryImageItem;
  isImageOnRight: boolean;
}

export default function GalleryImageRow({
  image,
  isImageOnRight,
}: GalleryImageRowProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${isImageOnRight ? "md:flex-row-reverse" : ""}`}
    >
      <div className="w-full md:w-1/2 group">
        <div className="w-full aspect-square md:aspect-video bg-zinc-900/40 relative overflow-hidden group rounded-3xl border border-zinc-800/50 shadow-2xl flex items-center justify-center">
          <Image
            src={image.url}
            alt={image.description || "Event Moment"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out p-1"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="bg-zinc-900/30 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-zinc-800/60 shadow-xl max-w-lg mx-auto md:mx-0">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
            {image.description}
          </p>
        </div>
      </div>
    </div>
  );
}
