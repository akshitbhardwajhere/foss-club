"use client";

import { ArrowLeft, Copy, Download, Mail, Search, Users } from "lucide-react";

interface RegistrationsHeaderProps {
  eventTitle: string;
  totalRegistrations: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onExportCsv: () => void;
  onEmailAll: () => void;
  onCopyAllEmails: () => void;
  canEmailAll: boolean;
}

export default function RegistrationsHeader({
  eventTitle,
  totalRegistrations,
  searchQuery,
  onSearchChange,
  onBack,
  onExportCsv,
  onEmailAll,
  onCopyAllEmails,
  canEmailAll,
}: RegistrationsHeaderProps) {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-3">
            <Users className="w-4 h-4 mr-2 inline" />
            {totalRegistrations} Total Registrations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {eventTitle || "Loading Event..."}
          </h1>
          <p className="text-zinc-400 mt-1 max-w-2xl">
            Real-time view of all registrants for this specific event instance.
            Use the export tool to generate spreadsheets.
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3 mt-4 md:mt-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search registrants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#111e16] border border-[#1b3123] h-10 pl-9 pr-4 rounded-lg text-white text-sm focus:outline-none focus:border-[#08B74F]/50 focus:ring-1 focus:ring-[#08B74F]/50 transition-all"
            />
          </div>
          <button
            onClick={onEmailAll}
            disabled={!canEmailAll}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#111e16] text-white hover:bg-[#16261b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-[#1b3123] whitespace-nowrap"
          >
            <Mail className="w-4 h-4" /> Email All
          </button>
          <button
            onClick={onCopyAllEmails}
            disabled={!canEmailAll}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#111e16] text-white hover:bg-[#16261b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-[#1b3123] whitespace-nowrap"
          >
            <Copy className="w-4 h-4" /> Copy Emails
          </button>
          <button
            onClick={onExportCsv}
            disabled={totalRegistrations === 0}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-zinc-700 whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}
