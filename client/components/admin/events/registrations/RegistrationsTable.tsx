"use client";

import { motion } from "framer-motion";
import { Mail, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Registrant } from "./types";

interface RegistrationsTableProps {
  loading: boolean;
  registrations: Registrant[];
  searchQuery: string;
  onClearSearch: () => void;
}

export default function RegistrationsTable({
  loading,
  registrations,
  searchQuery,
  onClearSearch,
}: RegistrationsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm"
    >
      <div className="overflow-x-auto min-h-100">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#08B74F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-zinc-500">
            <Users className="w-12 h-12 mb-4 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">
              No registrations found.
            </p>
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="mt-2 text-[#08B74F] text-sm hover:underline"
              >
                Clear search parameters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead className="bg-[#111e16] border-b border-[#1b3123] text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Participant</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Contact
                </th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">
                  Academic Details
                </th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {registrations.map((registrant) => (
                <tr
                  key={registrant.id}
                  className="hover:bg-zinc-800/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">
                      {registrant.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 md:hidden truncate max-w-37.5">
                      {registrant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />{" "}
                      {registrant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-zinc-300 font-medium">
                      {registrant.institute}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 max-w-50 truncate">
                      {registrant.branch} <br />
                      {registrant.enrollmentNo && `${registrant.enrollmentNo}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {registrant.isIndividual ? (
                      <span className="inline-flex px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                        Individual
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium content-center">
                          Team: {registrant.teamName}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-500 text-xs font-mono">
                    {formatDate(registrant.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
