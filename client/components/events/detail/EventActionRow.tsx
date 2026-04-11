"use client";

import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";

interface EventActionRowProps {
  isRegistrationOpen: boolean;
  isRegistrationClosed: boolean;
  registrationLink: string;
  hasDocument: boolean;
  isDownloading: boolean;
  onRegister: (link: string) => void;
  onDownload: () => void;
}

export default function EventActionRow({
  isRegistrationOpen,
  isRegistrationClosed,
  registrationLink,
  hasDocument,
  isDownloading,
  onRegister,
  onDownload,
}: EventActionRowProps) {
  if (!isRegistrationOpen && !isRegistrationClosed && !hasDocument) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-10 z-10 w-full flex flex-wrap justify-center items-center gap-4 border-t border-zinc-800/40 pt-8 -mt-4"
    >
      {isRegistrationOpen ? (
        <button
          onClick={() => onRegister(registrationLink)}
          className="px-8 py-3.5 bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(8,183,79,0.3)] hover:shadow-[0_0_30px_rgba(8,183,79,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-1"
        >
          Register Now
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      ) : isRegistrationClosed ? (
        <div className="px-8 py-3.5 bg-zinc-800 text-zinc-400 font-bold text-lg rounded-xl border border-zinc-700 flex items-center gap-2 cursor-not-allowed">
          Registrations are closed
        </div>
      ) : null}

      {hasDocument && (
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-[#08B74F]/20 bg-[#08B74F]/5 hover:bg-[#08B74F]/10 hover:border-[#08B74F]/40 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#08B74F]/10 group-hover:bg-[#08B74F]/20 transition-colors shrink-0">
            {isDownloading ? (
              <Loader2 className="w-4 h-4 text-[#08B74F] animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-[#08B74F]" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white leading-none mb-0.5">
              Agenda
            </p>
            <p className="text-xs text-zinc-500">
              {isDownloading ? "Downloading..." : "Download PDF"}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-zinc-500 group-hover:text-[#08B74F] transition-colors shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
