"use client";

import { useState } from "react";
import { Share2, Link, Twitter, Linkedin, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface EventShareProps {
  title: string;
}

export default function EventShare({ title }: EventShareProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopy = async () => {
    const url = getShareUrl();
    if (!url) return;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this exciting event: "${title}" at FOSS Club NIT Srinagar! 🚀`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleLinkedinShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleWhatsappShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Hey, check out this event: "${title}" - `);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-2xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-3 text-zinc-300 font-semibold text-sm">
        <Share2 className="w-4 h-4 text-[#08B74F]" />
        <span>Share Event</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={handleCopy}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all group"
          title="Copy Link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#08B74F]" />
          ) : (
            <Link className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-[10px] font-medium">Copy</span>
        </button>

        <button
          onClick={handleTwitterShare}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all group"
          title="Share on X"
        >
          <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium">X / Twitter</span>
        </button>

        <button
          onClick={handleLinkedinShare}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all group"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium">LinkedIn</span>
        </button>

        <button
          onClick={handleWhatsappShare}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all group"
          title="Share on WhatsApp"
        >
          {/* WhatsApp standard green glow on hover */}
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.99C16.555 1.875 14.09 .843 11.473.843 6.037.843 1.613 5.263 1.611 10.707c-.001 1.716.452 3.39 1.309 4.869L1.9 21.053l5.807-1.524c-.03-.021-.06-.041-.09-.062z" />
            <path d="M17.472 14.382c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.17-.72.15-.22.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.34-.49-2.56-1.58-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.56.16-.18.22-.3.32-.51.1-.21.05-.39-.02-.55-.07-.17-.72-1.74-.99-2.38-.26-.63-.53-.54-.72-.55-.19-.01-.41-.01-.62-.01-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.28 3.26.16.21 2.22 3.39 5.39 4.75.75.32 1.34.52 1.8.66.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.48.27-.71.27-1.33.19-1.45-.07-.12-.27-.2-.59-.36z" />
          </svg>
          <span className="text-[10px] font-medium">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
