"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, ChevronLeft, Calendar, PlusCircle, Images, Trash2, Edit2, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

interface Event {
    id: string;
    title: string;
    date: string;
}

interface GalleryImage {
    id: string;
    url: string;
    description: string;
    order: number;
}

export default function AdminGalleryPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    
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
            const sortedEvents = completedEvents.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
        if (!newImageDesc.trim()) return toast.error("Please provide a description");
        
        if (galleryImages.length >= 10) {
            return toast.error("Maximum 10 images allowed per event.");
        }

        setIsSubmitting(true);
        try {
            const res = await api.post(`/api/gallery/${selectedEvent.id}`, {
                url: newImageUrl,
                description: newImageDesc
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
        if (!window.confirm("Are you sure you want to remove this image from the gallery?")) return;
        
        try {
            await api.delete(`/api/gallery/${imageId}`);
            setGalleryImages(galleryImages.filter(img => img.id !== imageId));
            toast.success("Image removed");
        } catch (error) {
            toast.error("Failed to remove image");
        }
    };

    const handleUpdateImage = async (imageId: string) => {
        if (!editDescription.trim()) return toast.error("Description cannot be empty");
        setIsUpdating(true);
        try {
            const res = await api.put(`/api/gallery/${imageId}`, {
                description: editDescription
            });
            setGalleryImages(galleryImages.map(img => img.id === imageId ? { ...img, description: res.data.description } : img));
            setEditingImageId(null);
            toast.success("Image description updated!");
        } catch (error) {
            toast.error("Failed to update description");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-[#08B74F]" /></div>;
    }

    if (!selectedEvent) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full min-h-screen">
                <div className="mb-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#08B74F]/10 border border-[#08B74F]/20 text-[#08B74F] font-bold text-sm tracking-wide mb-4">
                            <Images className="w-4 h-4" /> EVENT GALLERY
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md">
                            Manage Galleries
                        </h1>
                        <p className="text-zinc-400 mt-3 text-lg max-w-2xl">
                            Select a completed event to meticulously organize and upload memory showcases.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((evt) => (
                        <div 
                            key={evt.id} 
                            onClick={() => setSelectedEvent(evt)}
                            className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 cursor-pointer hover:border-[#08B74F]/50 hover:bg-zinc-800/80 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-[#08B74F]/20 flex items-center justify-center text-[#08B74F]">
                                    →
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-[#08B74F] transition-colors leading-tight mb-3 pr-8">{evt.title}</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-xs font-semibold text-zinc-400 mt-auto">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full min-h-screen">
            <button 
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group bg-zinc-900/40 px-5 py-2.5 rounded-full border border-zinc-800 w-fit hover:border-zinc-700"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            
            <div className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-3">
                    {selectedEvent.title}
                </h1>
                <p className="text-zinc-400 text-lg">Curate up to 10 highlights for this event's visual gallery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-5 xl:col-span-4 h-fit sticky top-6">
                    <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#08B74F] to-transparent opacity-50" />
                        
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <PlusCircle className="w-6 h-6 text-[#08B74F]" /> Add Showcase Image
                        </h3>
                        
                        {galleryImages.length >= 10 ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center shadow-inner">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Images className="w-6 h-6 text-red-500" />
                                </div>
                                <h4 className="text-red-400 font-bold text-lg mb-1">Gallery is Full</h4>
                                <p className="text-red-500/80 text-sm">Maximum limit of 10 images reached.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center justify-between text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                                        <span>Image File</span>
                                        <span className="text-[#08B74F] text-xs px-2 py-0.5 rounded bg-[#08B74F]/10">Required</span>
                                    </label>
                                    <ImageUpload value={newImageUrl} onChange={setNewImageUrl} />
                                </div>
                                
                                <div>
                                    <label className="flex items-center justify-between text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                                        <span>Image Context</span>
                                        <span className="text-[#08B74F] text-xs px-2 py-0.5 rounded bg-[#08B74F]/10">Required</span>
                                    </label>
                                    <textarea
                                        value={newImageDesc}
                                        onChange={(e) => setNewImageDesc(e.target.value)}
                                        rows={4}
                                        placeholder="Add a captivating description to pair with this highlight..."
                                        className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-2xl p-4 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] transition-all resize-none shadow-inner"
                                    />
                                </div>
                                
                                <button
                                    onClick={handleAddImage}
                                    disabled={isSubmitting || !newImageUrl || !newImageDesc.trim()}
                                    className="w-full bg-gradient-to-r from-[#08B74F] to-[#06933f] hover:from-[#09c958] hover:to-[#08B74F] text-black font-black py-4 rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_10px_30px_-10px_rgba(8,183,79,0.4)]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Save to Gallery <span className="text-xl leading-none">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery Manage List */}
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
                        <div className="flex justify-center py-20 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl"><Loader2 className="w-10 h-10 animate-spin text-[#08B74F]" /></div>
                    ) : galleryImages.length === 0 ? (
                        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-16 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
                                <Images className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Blank Canvas</h3>
                            <p className="text-zinc-500 max-w-md">The gallery for this event is currently empty. Upload your first highlight using the console on the left!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {galleryImages.map((img) => (
                                <div key={img.id} className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-3xl p-5 flex flex-col group hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-300 shadow-lg">
                                    <div className="w-full h-48 bg-zinc-950 rounded-2xl overflow-hidden mb-5 relative shadow-inner">
                                        <Image src={img.url} alt="" fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <button 
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-xl backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setEditingImageId(img.id);
                                                setEditDescription(img.description);
                                            }}
                                            className="absolute top-3 right-16 w-10 h-10 bg-blue-500/90 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-xl backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100"
                                            title="Edit description"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 px-2 overflow-hidden flex flex-col">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-2">Description</h4>
                                        {editingImageId === img.id ? (
                                            <div className="flex flex-col gap-2 flex-1">
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-zinc-950/50 border border-zinc-700 text-white rounded-xl p-2 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] text-sm resize-none transition-all"
                                                />
                                                <div className="flex items-center justify-end gap-2 mt-auto pt-2">
                                                    <button
                                                        onClick={() => setEditingImageId(null)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateImage(img.id)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#08B74F] text-black hover:bg-[#09c958] disabled:opacity-50 flex items-center gap-1 transition-colors"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">{img.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
