"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import EventSelectionView from "@/components/admin/gallery/EventSelectionView";
import GalleryUploadPanel from "@/components/admin/gallery/GalleryUploadPanel";
import GalleryManageGrid from "@/components/admin/gallery/GalleryManageGrid";
import type { EventItem, GalleryImage } from "@/components/admin/gallery/types";

export default function AdminGalleryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // New Image State
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageDesc, setNewImageDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Image State
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchGallery(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events");
      // Filter only completed events (events strictly in the past, not today)
      const completedEvents = res.data.filter((evt: any) => {
        const now = new Date();
        const eventDate = new Date(evt.date);
        const isLive = now.toDateString() === eventDate.toDateString();
        return eventDate < now && !isLive;
      });
      // sort by date descending to show newest first
      const sortedEvents = completedEvents.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setEvents(sortedEvents);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async (eventId: string) => {
    setLoadingGallery(true);
    try {
      const res = await api.get(`/api/gallery/${eventId}`);
      setGalleryImages(res.data);
    } catch (error) {
      toast.error("Failed to fetch gallery images");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleAddImage = async () => {
    if (!selectedEvent) return;
    if (!newImageUrl) return toast.error("Please upload an image first");
    if (!newImageDesc.trim())
      return toast.error("Please provide a description");

    if (galleryImages.length >= 10) {
      return toast.error("Maximum 10 images allowed per event.");
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/api/gallery/${selectedEvent.id}`, {
        url: newImageUrl,
        description: newImageDesc,
      });

      setGalleryImages([...galleryImages, res.data]);
      setNewImageUrl("");
      setNewImageDesc("");
      toast.success("Image added to gallery!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this image from the gallery?",
      )
    )
      return;

    try {
      await api.delete(`/api/gallery/${imageId}`);
      setGalleryImages(galleryImages.filter((img) => img.id !== imageId));
      toast.success("Image removed");
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  const handleUpdateImage = async (imageId: string) => {
    if (!editDescription.trim())
      return toast.error("Description cannot be empty");
    setIsUpdating(true);
    try {
      const res = await api.put(`/api/gallery/${imageId}`, {
        description: editDescription,
      });
      setGalleryImages(
        galleryImages.map((img) =>
          img.id === imageId
            ? { ...img, description: res.data.description }
            : img,
        ),
      );
      setEditingImageId(null);
      toast.success("Image description updated!");
    } catch (error) {
      toast.error("Failed to update description");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#08B74F]" />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <EventSelectionView events={events} onSelectEvent={setSelectedEvent} />
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full min-h-screen">
      <button
        onClick={() => setSelectedEvent(null)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group bg-zinc-900/40 px-5 py-2.5 rounded-full border border-zinc-800 w-fit hover:border-zinc-700"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to Dashboard
      </button>

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-3">
          {selectedEvent.title}
        </h1>
        <p className="text-zinc-400 text-lg">
          Curate up to 10 highlights for this event's visual gallery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GalleryUploadPanel
          imageCount={galleryImages.length}
          newImageUrl={newImageUrl}
          newImageDesc={newImageDesc}
          isSubmitting={isSubmitting}
          onImageUrlChange={setNewImageUrl}
          onImageDescChange={setNewImageDesc}
          onAddImage={handleAddImage}
        />

        <GalleryManageGrid
          galleryImages={galleryImages}
          loadingGallery={loadingGallery}
          editingImageId={editingImageId}
          editDescription={editDescription}
          isUpdating={isUpdating}
          onEditStart={(imageId, description) => {
            setEditingImageId(imageId);
            setEditDescription(description);
          }}
          onEditDescriptionChange={setEditDescription}
          onEditCancel={() => setEditingImageId(null)}
          onUpdateImage={handleUpdateImage}
          onDeleteImage={handleDeleteImage}
        />
      </div>
    </div>
  );
}
