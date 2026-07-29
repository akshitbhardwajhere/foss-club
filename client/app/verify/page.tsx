"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Award,
  Calendar,
  User,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CertificateVerificationRecord {
  id: string;
  certificate_id: string;
  participant_name: string;
  event_name: string;
  issue_date: string;
  status: string;
  created_at: string;
}

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const certIdFromUrl = searchParams?.get("id") || "";

  const [searchId, setSearchId] = useState(certIdFromUrl);
  const [activeCertId, setActiveCertId] = useState(certIdFromUrl);
  const [certificate, setCertificate] = useState<CertificateVerificationRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  // Sync activeCertId when URL param changes
  useEffect(() => {
    if (certIdFromUrl) {
      setSearchId(certIdFromUrl);
      setActiveCertId(certIdFromUrl);
      verifyCertificate(certIdFromUrl);
    }
  }, [certIdFromUrl]);

  const verifyCertificate = async (idToVerify: string) => {
    const trimmedId = idToVerify.trim();
    if (!trimmedId) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsConfigured(false);
      setLoading(false);
      return;
    }
    setIsConfigured(true);

    try {
      const { data, error } = await supabase
        .from("certificate_verification")
        .select("*")
        .eq("certificate_id", trimmedId)
        .maybeSingle();

      if (error) {
        console.error("Supabase verification query error:", error);
        setErrorMsg("Error communicating with verification database.");
        setCertificate(null);
      } else if (!data) {
        setCertificate(null);
      } else {
        setCertificate(data);
      }
    } catch (err: any) {
      console.error("Verification execution error:", err);
      setErrorMsg("An unexpected error occurred during verification.");
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    router.push(`/verify?id=${encodeURIComponent(searchId.trim())}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-start">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08B74F]/10 border border-[#08B74F]/20 text-[#08B74F] text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Verification System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Verify <span className="text-[#08B74F]">Certificate</span>
        </h1>
        <p className="mt-3 text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
          Enter a certificate ID below or scan the QR code on your document to verify authenticity against our public registry.
        </p>
      </motion.div>

      {/* Search Input Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-3 sm:p-4 rounded-2xl shadow-2xl mb-8"
      >
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. FS-2026-00001"
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] text-white font-mono placeholder:font-sans placeholder-zinc-500 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base outline-none transition-all"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="w-full sm:w-auto bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(8,183,79,0.25)] hover:scale-105 shrink-0"
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </Button>
        </form>
      </motion.div>

      {/* Unconfigured Warning */}
      {!isConfigured && (
        <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Supabase Verification Database Not Connected</p>
            <p className="text-amber-300/80 text-xs mt-1">
              Please configure <code className="bg-black/40 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded">.env</code> to connect to your public Supabase database.
            </p>
          </div>
        </div>
      )}

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-2xl text-center flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-12 h-12 border-4 border-[#08B74F]/20 border-t-[#08B74F] rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm font-medium animate-pulse">
              Querying Supabase Verification Registry...
            </p>
          </motion.div>
        ) : searched && certificate ? (
          /* Verified Result Card */
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-[#08B74F]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(8,183,79,0.12)] relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#08B74F]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#08B74F]/20 border border-[#08B74F]/40 flex items-center justify-center text-[#08B74F]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Certificate Verified
                    <Sparkles className="w-4 h-4 text-[#08B74F]" />
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">ID: {certificate.certificate_id}</p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{certificate.status || "Valid"}</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <User className="w-4 h-4 text-[#08B74F]" />
                  <span>Participant Name</span>
                </div>
                <p className="text-lg font-bold text-white">{certificate.participant_name}</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4 text-[#08B74F]" />
                  <span>Event / Workshop</span>
                </div>
                <p className="text-lg font-bold text-white">{certificate.event_name || "FOSS Club Event"}</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 text-[#08B74F]" />
                  <span>Issue Date</span>
                </div>
                <p className="text-base font-semibold text-zinc-200">{certificate.issue_date}</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Building2 className="w-4 h-4 text-[#08B74F]" />
                  <span>Issuing Organization</span>
                </div>
                <p className="text-base font-semibold text-zinc-200">FOSS Club, NIT Srinagar</p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
              <p>Verified offsite from FOSS NIT Srinagar cloud registry.</p>
              <Link
                href="/"
                className="text-[#08B74F] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Back to FOSS Home</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ) : searched && !certificate ? (
          /* Invalid / Not Found Result Card */
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-red-950/20 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center"
          >
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              This certificate ID (<code className="text-red-300 font-mono">{activeCertId}</code>) is invalid, does not exist in our public database, or has been revoked.
            </p>
            <p className="text-xs text-zinc-500">
              Please check the certificate ID printed on your document and try again.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 pb-20 px-4 text-center text-zinc-400">
          Loading certificate verification...
        </div>
      }
    >
      <VerifyCertificateContent />
    </Suspense>
  );
}
