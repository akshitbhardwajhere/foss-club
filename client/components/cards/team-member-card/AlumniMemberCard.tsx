"use client";

import { GraduationCap, Building2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TeamMemberMobileDialog from "./TeamMemberMobileDialog";
import type { SocialLink, TeamMember } from "./types";

interface AlumniMemberCardProps {
  id?: string;
  member: TeamMember;
  avatarSrc: string;
  priority?: boolean;
  isAlumni: boolean;
  textTheme: string;
  codeLines: string[];
  socialLinks: SocialLink[];
  className?: string;
}

/**
 * AlumniMemberCard Component
 *
 * A specialized profile card for alumni members.
 * Displays their name, FOSS role, squircle profile image, and their current company/organization.
 * Clicking the card opens the detailed terminal dialog.
 */
export default function AlumniMemberCard({
  id,
  member,
  avatarSrc,
  priority,
  isAlumni,
  textTheme,
  codeLines,
  socialLinks,
  className = "",
}: AlumniMemberCardProps) {
  return (
    <div id={id} className={`${className} w-full`}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-4 cursor-pointer w-full p-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/35 backdrop-blur-xs transition-all duration-300 hover:bg-zinc-900/60 hover:border-yellow-500/30 hover:shadow-[0_4px_25px_-8px_rgba(234,179,8,0.2)] hover:-translate-y-0.5 group">
            
            {/* Squircle Avatar container */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-zinc-800/50 p-0.5 transition-all duration-300 group-hover:scale-105">
              <Image
                src={avatarSrc}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 80px, 120px"
                className="rounded-xl object-cover bg-zinc-950"
                style={{ imageRendering: "auto" }}
                priority={priority}
              />
              <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-yellow-500 rounded-full border-2 border-zinc-950 flex items-center justify-center z-20 shadow-md">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-950" />
              </div>
            </div>

            {/* Info container */}
            <div className="flex flex-col min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                {member.name}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate mt-0.5">
                {member.role}
              </p>
              
              {member.company && (
                <div className="flex items-center gap-1.5 mt-2.5 bg-yellow-500/5 border border-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-lg w-fit max-w-full">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    {member.company}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogTrigger>

        <TeamMemberMobileDialog
          member={member}
          avatarSrc={avatarSrc}
          isAlumni={isAlumni}
          textTheme={textTheme}
          codeLines={codeLines}
          socialLinks={socialLinks}
        />
      </Dialog>
    </div>
  );
}
