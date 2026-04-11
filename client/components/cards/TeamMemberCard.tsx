"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, GraduationCap, X, Crown } from "lucide-react";
import { ensureUrl } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company?: string;
  imageUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  itemVariants: any; // We receive inherited motion variants from the parent layout
  priority?: boolean;
}

export default function TeamMemberCard({
  member,
  itemVariants,
  priority,
}: TeamMemberCardProps) {
  const avatarSrc =
    member.imageUrl ||
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${member.name}`;
  const firstName = member.name.split(" ")[0];
  const isAlumni =
    !!member.company ||
    member.role.toLowerCase().includes("alumni") ||
    member.role.toLowerCase().includes("former");
  const colorTheme = isAlumni ? "yellow-500" : "[#08B74F]";
  const textTheme = isAlumni ? "text-yellow-500" : "text-[#08B74F]";
  const shadowTheme = isAlumni ? "rgba(234,179,8,0.1)" : "rgba(8,183,79,0.1)";
  const codeLines = [
    `const member = ${JSON.stringify(member.name)};`,
    `const role = ${JSON.stringify(member.role)};`,
    member.company
      ? `const org = ${JSON.stringify(member.company)};`
      : 'const mode = "build";',
    isAlumni ? "git checkout legacy && yarn story" : "npm run innovate",
  ];
  const socialLinks = [
    member.githubUrl && {
      href: ensureUrl(member.githubUrl),
      title: "GitHub profile",
      className: "text-zinc-400 hover:text-white hover:bg-zinc-800",
      icon: <Github className="w-5 h-5" />,
    },
    member.linkedinUrl && {
      href: ensureUrl(member.linkedinUrl),
      title: "LinkedIn profile",
      className: "text-zinc-400 hover:text-[#0A66C2] hover:bg-zinc-800",
      icon: <Linkedin className="w-5 h-5" />,
    },
    member.twitterUrl && {
      href: ensureUrl(member.twitterUrl),
      title: "X profile",
      className: "text-zinc-400 hover:text-sky-500 hover:bg-zinc-800",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.774H18.916L7.084 4.126H5.117L17.083 19.774Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ].filter(Boolean) as Array<{
    href: string;
    title: string;
    className: string;
    icon: ReactNode;
  }>;

  const renderSocialLinks = (buttonClassName: string) =>
    socialLinks.map((social) => (
      <a
        key={social.title}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.title}
        title={social.title}
        className={`${buttonClassName} ${social.className}`}
      >
        {social.icon}
      </a>
    ));

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full flex justify-center"
    >
      {/* Desktop Full Card View */}
      <div
        className={`hidden sm:flex w-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2rem] p-8 flex-col items-center group hover:border-${colorTheme}/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_${shadowTheme}] transition-all duration-500 overflow-hidden relative`}
      >
        <div
          className={`absolute inset-0 bg-linear-to-b from-${colorTheme}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="w-44 h-44 rounded-full bg-zinc-800 p-2 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={avatarSrc}
            alt={member.name}
            width={352}
            height={352}
            className="w-full h-full rounded-full object-cover bg-zinc-950"
            style={{ imageRendering: "auto" }}
            priority={priority}
          />
        </div>
        <h3 className="text-xl font-bold mb-1 relative z-10 text-center text-white">
          {member.name}
        </h3>
        <p
          className={`${textTheme} font-medium relative z-10 text-center ${member.company ? "mb-1" : "mb-6"} inline-flex items-center gap-1`}
        >
          {isAlumni && <GraduationCap className="w-4 h-4" />} {member.role}
        </p>
        {member.company && (
          <p className="text-zinc-400 text-sm mb-6 relative z-10 text-center">
            @ {member.company}
          </p>
        )}
        <div className="flex gap-4 relative z-10">
          {renderSocialLinks(
            "w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center transition-colors",
          )}
        </div>
      </div>

      {/* Mobile Dense Grid View + Clickable Modal Overlay */}
      <div className="flex sm:hidden w-full">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center gap-2 cursor-pointer w-full group relative">
              <div className="w-full aspect-square rounded-2xl bg-zinc-800 p-0.75 relative ring-0 transition-all">
                {member.role === "Team Lead" && (
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-yellow-500 rounded-full border-[3px] border-zinc-950 flex items-center justify-center z-30 -rotate-45 shadow-lg">
                    <Crown className="w-5 h-5 text-zinc-950 fill-zinc-950" />
                  </div>
                )}
                <Image
                  src={avatarSrc}
                  alt={member.name}
                  fill
                  sizes="25vw"
                  className="rounded-[10px] object-cover bg-zinc-950"
                  style={{ imageRendering: "auto" }}
                  priority={priority}
                />
                {isAlumni && (
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-yellow-500 rounded-full border border-black flex items-center justify-center z-20">
                    <GraduationCap className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <p className="text-zinc-200 text-xs sm:text-sm font-semibold text-center truncate w-full group-hover:text-white transition-colors">
                {firstName}
              </p>
            </div>
          </DialogTrigger>

          <DialogContent
            showCloseButton={false}
            className={`sm:hidden bg-[#050B08] border border-zinc-800 text-white w-[92vw] max-w-95 rounded-[2rem] p-0 overflow-hidden shadow-2xl shadow-black/80`}
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
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
                  {isAlumni && <GraduationCap className="h-4 w-4" />}{" "}
                  {member.role}
                </p>
                {member.company && (
                  <p className="mt-1 text-center text-sm text-zinc-400">
                    @ {member.company}
                  </p>
                )}

                <div className="mt-5 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/85 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.34em] text-zinc-500">
                    <span>terminal</span>
                    <span
                      className={
                        isAlumni ? "text-yellow-500" : "text-[#08B74F]"
                      }
                    >
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
                  {renderSocialLinks(
                    "w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center transition-colors",
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
