"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import { Loader2, ChevronLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface GalleryImage {
  id: string;
  url: string;
  description: string;
  order: number;
}

export default function EventGalleryDetails() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    
    const fetchGalleryData = async () => {
      try {
        const [eventRes, galleryRes] = await Promise.all([
          api.get(`/api/events/${params.id}`),
          api.get(`/api/gallery/${params.id}`)
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
        <Link href="/gallery" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Galleries
        </Link>
        
        <PageHeader title={event.title} />
        
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300">
            <Calendar className="w-4 h-4 text-[#08B74F]" />
            <span className="text-sm font-medium">
              {new Date(event.date).toLocaleDateString("en-US", { day: 'numeric', month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <p className="text-zinc-400 text-lg">No photos have been added to this gallery yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24">
            {images.map((img, index) => {
              // Odd image on left -> index 0, 2, 4 (even logically)
              // Even image on right -> index 1, 3, 5 (odd logically)
              const isImageOnRight = index % 2 !== 0;

              return (
                <div 
                  key={img.id} 
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${
                    isImageOnRight ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-1/2 group">
                    <div className="relative rounded-3xl overflow-hidden border border-zinc-800/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-[#08B74F]/30">
                      <img 
                        src={img.url} 
                        alt="Event Moment" 
                        className="w-full h-auto object-cover max-h-[500px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <div className="bg-zinc-900/30 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-zinc-800/60 shadow-xl max-w-lg mx-auto md:mx-0">
                      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                        {img.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
