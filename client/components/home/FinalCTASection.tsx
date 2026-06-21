"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-28 z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-[#08B74F]/20 bg-gradient-to-br from-[#08B74F]/10 via-zinc-900/60 to-zinc-950 p-10 sm:p-16 text-center"
      >
        {/* Glow blobs */}
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[60%] h-[200%] bg-[#08B74F]/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#08B74F 1px, transparent 1px), linear-gradient(90deg, #08B74F 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#08B74F] mb-6 px-3 py-1.5 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/10">
            Open to All Students
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] via-emerald-400 to-[#08B74F] bg-[length:200%_auto] animate-gradient">
              Open Source Journey?
            </span>
          </h2>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Join hundreds of developers building the future — one commit at a time.
            No experience required. Just curiosity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-[#08B74F] hover:bg-[#08B74F]/90 text-black font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-[0_0_40px_rgba(8,183,79,0.3)] hover:shadow-[0_0_60px_rgba(8,183,79,0.5)] hover:-translate-y-0.5"
            >
              Join the Club
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="https://chat.whatsapp.com/HmPTOeQMjEn6PTLS3bdt8w"
              className="inline-flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-zinc-700 hover:border-indigo-500/60 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 hover:bg-zinc-800/80 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Join WhatsApp Community
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-semibold px-6 py-4 rounded-full text-base transition-colors"
            >
              View Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
