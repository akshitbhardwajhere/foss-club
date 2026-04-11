"use client";

import { motion } from "framer-motion";
import { GraduationCap, X } from "lucide-react";
import Image from "next/image";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MemberSocialLinks from "./MemberSocialLinks";
import type { SocialLink, TeamMember } from "./types";

interface TeamMemberMobileDialogProps {
  member: TeamMember;
  avatarSrc: string;
  isAlumni: boolean;
  textTheme: string;
  codeLines: string[];
  socialLinks: SocialLink[];
}

export default function TeamMemberMobileDialog({
  member,
  avatarSrc,
  isAlumni,
  textTheme,
  codeLines,
  socialLinks,
}: TeamMemberMobileDialogProps) {
  return (
    <DialogContent
      showCloseButton={false}
      className="sm:hidden bg-[#050B08] border border-zinc-800 text-white w-[92vw] max-w-95 rounded-[2rem] p-0 overflow-hidden shadow-2xl shadow-black/80"
    >
      <DialogTitle className="sr-only">
        Detailed Profile of {member.name}
      </DialogTitle>
      <DialogHeader className="hidden">
        <DialogTitle>{member.name}</DialogTitle>
      </DialogHeader>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(8,183,79,0.24),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_28%,rgba(0,0,0,0.3)_100%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 p-4 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              className={`h-2.5 w-2.5 rounded-full ${isAlumni ? "bg-yellow-500" : "bg-[#08B74F]"}`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.55, 1, 0.55] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-[10px] uppercase tracking-[0.38em] text-zinc-400">
              live debug
            </span>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="relative z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/70 text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              aria-label="Close profile dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </div>

        <div className="relative z-10 px-5 pt-4 pb-5">
          <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
            <motion.div
              className={`absolute inset-0 rounded-full border border-dashed ${isAlumni ? "border-yellow-500/40" : "border-[#08B74F]/40"}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className={`absolute inset-3 rounded-full bg-linear-to-br ${isAlumni ? "from-yellow-500/20 via-zinc-950 to-zinc-900" : "from-[#08B74F]/20 via-zinc-950 to-zinc-900"}`}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className={`absolute left-3 top-6 h-3 w-3 rounded-full ${isAlumni ? "bg-yellow-400" : "bg-[#08B74F]"}`}
              animate={{ y: [0, -14, 0], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className={`absolute right-4 bottom-5 h-2.5 w-2.5 rounded-full ${isAlumni ? "bg-amber-300" : "bg-emerald-300"}`}
              animate={{ y: [0, 12, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.25,
              }}
            />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-[0_0_45px_rgba(0,0,0,0.45)]">
              <Image
                src={avatarSrc}
                alt={member.name}
                width={256}
                height={256}
                className="h-full w-full rounded-full object-cover bg-zinc-950"
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center text-white">
            {member.name}
          </h3>
          <p
            className={`${textTheme} mt-1 flex items-center justify-center gap-1 text-center font-medium`}
          >
            {isAlumni && <GraduationCap className="h-4 w-4" />} {member.role}
          </p>
          {member.company && (
            <p className="mt-1 text-center text-sm text-zinc-400">
              @ {member.company}
            </p>
          )}

          <div className="mt-5 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/85 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.34em] text-zinc-500">
              <span>terminal</span>
              <span className={isAlumni ? "text-yellow-500" : "text-[#08B74F]"}>
                connected
              </span>
            </div>

            <div className="space-y-2 font-mono text-[12px] leading-5 text-zinc-300">
              {codeLines.map((line, index) => (
                <motion.div
                  key={line}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 * index }}
                >
                  <span
                    className={`${index === 0 ? "text-white" : isAlumni ? "text-yellow-400" : "text-[#08B74F]"}`}
                  >
                    {index === 0 ? "$" : ">"}
                  </span>
                  <motion.span
                    className="block"
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15,
                    }}
                  >
                    {line}
                  </motion.span>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center gap-2 text-zinc-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <span>_</span>
                <motion.span
                  className={`h-4 w-0.5 ${isAlumni ? "bg-yellow-500" : "bg-[#08B74F]"}`}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["compile", "sync", "ship"].map((label, index) => (
              <motion.div
                key={label}
                className={`rounded-full border px-3 py-2 text-center text-[10px] uppercase tracking-[0.24em] ${isAlumni ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400" : "border-[#08B74F]/20 bg-[#08B74F]/10 text-[#08B74F]"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 * index }}
              >
                <motion.span
                  className="inline-block"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                >
                  {label}
                </motion.span>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <MemberSocialLinks
              links={socialLinks}
              iconSize={24}
              buttonClassName="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center transition-colors"
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
