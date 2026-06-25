"use client";

import { ArrowLeft, Copy, Download, Mail, Users } from "lucide-react";

interface RegistrationsHeaderProps {
  eventTitle: string;
  totalRegistrations: number;
  onBack: () => void;
  onExportCsv: () => void;
  onEmailAll: () => void;
  onCopyAllEmails: () => void;
  canEmailAll: boolean;
}

export default function RegistrationsHeader({
  eventTitle,
  totalRegistrations,
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
