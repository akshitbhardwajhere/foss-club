"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import GalleryDatePill from "@/components/gallery/detail/GalleryDatePill";
import GalleryImageRow from "@/components/gallery/detail/GalleryImageRow";
import type {
  GalleryEvent,
  GalleryImageItem,
} from "@/components/gallery/detail/types";

/**
 * EventGalleryDetails Component
 *
 * Dynamically loads and presents all high-resolution photos associated with a specific completed event.
 * Arranges images in an alternating zigzag pattern (image left, image right) with their respective descriptions.
 */
export default function EventGalleryDetails() {
  const params = useParams();
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const fetchGalleryData = async () => {
      try {
        const [eventRes, galleryRes] = await Promise.all([
          api.get(`/api/events/${params.id}`),
          api.get(`/api/gallery/${params.id}`),
        ]);
        setEvent(eventRes.data);
        setImages(galleryRes.data);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#050B08] min-h-screen flex items-center justify-center pt-32 pb-20">
        <Loader2 className="w-12 h-12 animate-spin text-[#08B74F]" />
      </div>
    );
  }

  if (error || !event) {
    return notFound();
  }

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Galleries
        </Link>

        <PageHeader title={event.title} />

        <div className="flex justify-center mb-16">
          <GalleryDatePill date={event.date} />
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <p className="text-zinc-400 text-lg">
              No photos have been added to this gallery yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24">
            {images.map((image, index) => (
              <GalleryImageRow
                key={image.id}
                image={image}
                isImageOnRight={index % 2 !== 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
