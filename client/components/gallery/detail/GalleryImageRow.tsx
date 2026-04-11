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
      <div className="w-full md:w-[58%] group">
        <div className="w-full aspect-4/3 md:aspect-16/10 bg-zinc-950/40 relative overflow-hidden rounded-3xl border border-zinc-800/60 shadow-2xl group flex items-center justify-center">
          <Image
            src={image.url}
            alt={image.description || "Event Moment"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-3xl"
          />
          <div className="absolute inset-0 opacity-60 pointer-events-none rounded-3xl" />
        </div>
      </div>

      <div className="w-full md:w-[42%]">
        <div className="bg-zinc-900/30 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-zinc-800/60 shadow-xl max-w-lg mx-auto md:mx-0">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
            {image.description}
          </p>
        </div>
      </div>
    </div>
  );
}
